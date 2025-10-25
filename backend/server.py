from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Availability Request Model
class AvailabilityRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    message: Optional[str] = ""
    services: List[str]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    language: str = "de"
    status_processed: bool = False
    notes: Optional[str] = ""

class AvailabilityRequestCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: Optional[str] = ""
    services: List[str]
    language: str = "de"

# Job Application Model
class JobApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    position: str
    marital_status: str
    foreign_languages: str
    drivers_license: str
    employment_type: str
    preferred_shift: str
    work_days_preference: str
    about_yourself: str
    qualifications: str
    empathic_abilities: str
    number_of_children: str
    why_work_here: str
    photo: Optional[str] = None  # Base64 encoded photo
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    language: str = "de"
    status_processed: bool = False
    notes: Optional[str] = ""

class JobApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    position: str
    marital_status: str
    foreign_languages: str
    drivers_license: str
    employment_type: str
    preferred_shift: str
    work_days_preference: str
    about_yourself: str
    qualifications: str
    empathic_abilities: str
    number_of_children: str
    why_work_here: str
    photo: Optional[str] = None  # Base64 encoded photo
    language: str = "de"

# Chat Message Models
class ChatMessage(BaseModel):
    session_id: str
    message: str
    language: str = "de"

class ChatResponse(BaseModel):
    response: str
    session_id: str


# Appointment Models
class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_number: str
    date: str  # Format: YYYY-MM-DD
    time: str  # Format: HH:00
    client_name: str
    phone: str
    location: str
    notes: Optional[str] = None
    appointment_type: str  # 'video_conference', 'in_person', 'phone', 'online_email'
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentCreate(BaseModel):
    client_number: str
    date: str
    time: str
    client_name: str
    phone: str
    location: str
    notes: Optional[str] = None
    appointment_type: str


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/availability-request", response_model=AvailabilityRequest)
async def create_availability_request(request_input: AvailabilityRequestCreate):
    """Create and process availability request"""
    try:
        # Create request object
        request_obj = AvailabilityRequest(**request_input.model_dump())
        
        # Save to database
        doc = request_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.availability_requests.insert_one(doc)
        
        logger.info(f"Availability request {request_obj.id} saved to database")
        
        return request_obj
        
    except Exception as e:
        logger.error(f"Error processing availability request: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process request")

@api_router.get("/availability-requests", response_model=List[AvailabilityRequest])
async def get_availability_requests():
    """Get all availability requests"""
    requests = await db.availability_requests.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for req in requests:
        if isinstance(req['timestamp'], str):
            req['timestamp'] = datetime.fromisoformat(req['timestamp'])
    
    return requests

# Job Application endpoints
@api_router.post("/job-applications", response_model=JobApplication)
async def create_job_application(application_input: JobApplicationCreate):
    """Create and process job application"""
    try:
        # Create application object
        application_obj = JobApplication(**application_input.model_dump())
        
        # Save to database
        doc = application_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.job_applications.insert_one(doc)
        
        logger.info(f"Job application {application_obj.id} saved to database")
        
        return application_obj
        
    except Exception as e:
        logger.error(f"Error processing job application: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process application")

@api_router.get("/job-applications", response_model=List[JobApplication])
async def get_job_applications():
    """Get all job applications"""
    applications = await db.job_applications.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for app in applications:
        if isinstance(app['timestamp'], str):
            app['timestamp'] = datetime.fromisoformat(app['timestamp'])
    
    return applications

# Update availability request status and notes
@api_router.patch("/availability-requests/{request_id}")
async def update_availability_request(
    request_id: str, 
    status_processed: Optional[bool] = Query(None),
    notes: Optional[str] = Query(None)
):
    """Update status and notes for an availability request"""
    try:
        update_data = {}
        if status_processed is not None:
            update_data['status_processed'] = status_processed
        if notes is not None:
            update_data['notes'] = notes
            
        result = await db.availability_requests.update_one(
            {"id": request_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Request not found")
            
        return {"success": True, "message": "Updated successfully"}
    except HTTPException:
        raise  # Re-raise HTTPExceptions (like 404) as-is
    except Exception as e:
        logger.error(f"Error updating request: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update request")

# Delete availability request
@api_router.delete("/availability-requests/{request_id}")
async def delete_availability_request(request_id: str):
    """Delete an availability request"""
    try:
        result = await db.availability_requests.delete_one({"id": request_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Request not found")
            
        logger.info(f"Deleted availability request {request_id}")
        return {"success": True, "message": "Request deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting request: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete request")


# Update job application status and notes
@api_router.patch("/job-applications/{application_id}")
async def update_job_application(
    application_id: str,
    status_processed: Optional[bool] = Query(None),
    notes: Optional[str] = Query(None)
):
    """Update status and notes for a job application"""
    try:
        update_data = {}
        if status_processed is not None:
            update_data['status_processed'] = status_processed
        if notes is not None:
            update_data['notes'] = notes
            
        result = await db.job_applications.update_one(
            {"id": application_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Application not found")
            
        return {"success": True, "message": "Updated successfully"}
    except HTTPException:
        raise  # Re-raise HTTPExceptions (like 404) as-is
    except Exception as e:
        logger.error(f"Error updating application: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update application")


# Delete job application
@api_router.delete("/job-applications/{application_id}")
async def delete_job_application(application_id: str):
    """Delete a job application"""
    try:
        result = await db.job_applications.delete_one({"id": application_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Application not found")
            
        logger.info(f"Deleted job application {application_id}")
        return {"success": True, "message": "Application deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting application: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete application")



# Appointment Endpoints
@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment_input: AppointmentCreate):
    """Create a new appointment"""
    try:
        appointment_obj = Appointment(**appointment_input.model_dump())
        
        # Save to database
        doc = appointment_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.appointments.insert_one(doc)
        
        logger.info(f"Appointment {appointment_obj.id} created for {appointment_obj.date} at {appointment_obj.time}")
        
        return appointment_obj
    except Exception as e:
        logger.error(f"Error creating appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create appointment")

@api_router.get("/appointments")
async def get_appointments(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Get all appointments, optionally filtered by date range"""
    try:
        query = {}
        if start_date and end_date:
            query['date'] = {'$gte': start_date, '$lte': end_date}
        
        appointments = await db.appointments.find(query, {"_id": 0}).to_list(length=None)
        
        # Convert timestamp strings back to datetime for response
        for app in appointments:
            if isinstance(app.get('timestamp'), str):
                app['timestamp'] = datetime.fromisoformat(app['timestamp'])
        
        return appointments
    except Exception as e:
        logger.error(f"Error retrieving appointments: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve appointments")

@api_router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    """Delete an appointment"""
    try:
        result = await db.appointments.delete_one({"id": appointment_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Appointment not found")
            
        logger.info(f"Deleted appointment {appointment_id}")
        return {"success": True, "message": "Appointment deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete appointment")


# AI Chatbot endpoint
@api_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_input: ChatMessage):
    """AI Customer Service Chatbot for OCTA"""
    try:
        # Get API key from environment
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        
        if not api_key:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        # Determine agent name and language
        agent_name = "Anna" if chat_input.language == "de" else "Thomas"
        
        # Create system message based on language
        if chat_input.language == "de":
            system_message = f"""Du bist Anna, eine einfühlsame und professionelle KI-Kundendienstmitarbeiterin für OCTA, einen Anbieter von ganzheitlichen Pflege- und Betreuungsdienstleistungen.

Du bist spezialisiert darauf, Patienten und Angehörigen im Gesundheitswesen mit Wärme, Mitgefühl und Professionalität zu helfen.

OCTA Dienstleistungen:
- Z1: Hauswirtschaftliche Hilfe - Unterstützung im Haushalt (Reinigung, Wäsche, Einkäufe, Mahlzeiten)
- Z2a: Pflegefach - Professionelle medizinische Pflege durch examinierte Pflegefachkräfte
- Z2b: PflegePlus - Erweiterte Pflegeleistungen mit zusätzlichen Betreuungsangeboten
- Z3: Betreuungshilfe - Soziale Betreuung, Begleitung zu Terminen, Gespräche
- Z4: Garten Dienste - Gartenpflege und Winterdienst
- Z5: Beratung und Assessment - Pflegeberatung und Bedarfsermittlung
- Z6: Hausmeisterdienste - Kleinreparaturen und Instandhaltung
- Z7: Betreutes Wohnen - Live-in-Pflege, OCTA Community Tiny Houses
- Z8: Wohlfühlstation - Wellness, kreative Angebote, Entspannung

Deine Aufgaben:
1. Beantworte Fragen über OCTA-Dienstleistungen klar und einfühlsam
2. Wenn ein Kunde einen Rückruf oder persönliche Beratung wünscht, biete an, ihn zum Kontaktformular weiterzuleiten
3. Sei geduldig, verständnisvoll und respektvoll
4. Verwende einfache, klare Sprache

Wenn jemand einen Rückruf wünscht, sage: "Gerne! Ich leite Sie zu unserem Kontaktformular weiter, wo Sie Ihre Informationen eingeben können. Ein Mitarbeiter wird sich schnellstmöglich bei Ihnen melden."
Dann antworte mit: [REDIRECT_TO_FORM]"""
        else:
            system_message = f"""You are Thomas, an empathetic and professional AI customer service representative for OCTA, a provider of comprehensive care and support services.

You specialize in helping healthcare patients and their families with warmth, compassion, and professionalism.

OCTA Services:
- Z1: Household Assistance - Support with housework (cleaning, laundry, shopping, meals)
- Z2a: Professional Care - Medical nursing care by certified nurses
- Z2b: Care Plus - Extended care services with additional support
- Z3: Care Support - Social care, accompaniment to appointments, conversations
- Z4: Garden Services - Garden maintenance and winter service
- Z5: Consulting & Assessment - Care consultation and needs assessment
- Z6: Facility Services - Minor repairs and maintenance
- Z7: Assisted Living - Live-in care, OCTA Community Tiny Houses
- Z8: Wellness Station - Wellness, creative activities, relaxation

Your tasks:
1. Answer questions about OCTA services clearly and empathetically
2. If a customer wants a callback or personal consultation, offer to redirect them to the contact form
3. Be patient, understanding, and respectful
4. Use simple, clear language

When someone wants a callback, say: "Of course! I'll redirect you to our contact form where you can enter your information. A team member will contact you as soon as possible."
Then respond with: [REDIRECT_TO_FORM]"""
        
        # Initialize chat with Claude Sonnet 4
        chat = LlmChat(
            api_key=api_key,
            session_id=chat_input.session_id,
            system_message=system_message
        ).with_model("anthropic", "claude-3-7-sonnet-20250219")
        
        # Create user message
        user_message = UserMessage(text=chat_input.message)
        
        # Get response from AI
        response = await chat.send_message(user_message)
        
        logger.info(f"Chat response generated for session {chat_input.session_id}")
        
        return ChatResponse(
            response=response,
            session_id=chat_input.session_id
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process chat message")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()