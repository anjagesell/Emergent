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

# Helper function to send email
async def send_availability_email(request_data: AvailabilityRequest):
    """Send availability request email"""
    smtp_server = os.environ.get('SMTP_SERVER')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_username = os.environ.get('SMTP_USERNAME')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    smtp_from = os.environ.get('SMTP_FROM_EMAIL')
    recipient = os.environ.get('RECIPIENT_EMAIL', 'Alltagshilfe007@web.de')
    
    # Check if SMTP is configured
    if not all([smtp_server, smtp_username, smtp_password, smtp_from]):
        logger.warning("SMTP not configured. Email not sent, but request saved to database.")
        return False
    
    try:
        # Service names mapping
        service_names_de = {
            'z1': 'Z1: Hauswirtschaftliche Hilfe',
            'z2a': 'Z2a: Pflegefach',
            'z2b': 'Z2b: Pflege Plus',
            'z3': 'Z3: Betreuungshilfe',
            'z4': 'Z4: Garten Dienste',
            'z5': 'Z5: Beratung und Assessment',
            'z6': 'Z6: Hausmeisterdienste',
            'z7': 'Z7: Betreutes Wohnen',
            'z8': 'Z8: Wohlfühlstation'
        }
        
        service_names_en = {
            'z1': 'Z1: Household Assistance',
            'z2a': 'Z2a: Professional Care',
            'z2b': 'Z2b: Care Plus',
            'z3': 'Z3: Care Support',
            'z4': 'Z4: Garden Services',
            'z5': 'Z5: Consulting & Assessment',
            'z6': 'Z6: Facility Services',
            'z7': 'Z7: Assisted Living',
            'z8': 'Z8: Wellness Station'
        }
        
        service_map = service_names_de if request_data.language == 'de' else service_names_en
        services_list = '\n'.join([f"• {service_map.get(s, s)}" for s in request_data.services])
        
        # Create email
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Neue Verfügbarkeitsanfrage von {request_data.name}"
        msg['From'] = smtp_from
        msg['To'] = recipient
        
        # Email body
        if request_data.language == 'de':
            email_body = f"""
Neue Verfügbarkeitsanfrage über die OCTA-Webseite
================================================

Kontaktdaten:
-------------
Name: {request_data.name}
E-Mail: {request_data.email}
Telefon: {request_data.phone}

Gewünschte Dienstleistungen:
-----------------------------
{services_list}

Nachricht:
----------
{request_data.message if request_data.message else 'Keine zusätzliche Nachricht'}

Datum/Uhrzeit: {request_data.timestamp.strftime('%d.%m.%Y um %H:%M Uhr')}
Anfrage-ID: {request_data.id}

---
Diese Anfrage wurde automatisch über das Kontaktformular auf der OCTA-Webseite erstellt.
            """
        else:
            email_body = f"""
New Availability Request via OCTA Website
==========================================

Contact Information:
--------------------
Name: {request_data.name}
Email: {request_data.email}
Phone: {request_data.phone}

Requested Services:
-------------------
{services_list}

Message:
--------
{request_data.message if request_data.message else 'No additional message'}

Date/Time: {request_data.timestamp.strftime('%m/%d/%Y at %H:%M')}
Request ID: {request_data.id}

---
This request was automatically created via the contact form on the OCTA website.
            """
        
        part = MIMEText(email_body, 'plain', 'utf-8')
        msg.attach(part)
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully for request {request_data.id}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

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
        
        # Try to send email
        email_sent = await send_availability_email(request_obj)
        
        if email_sent:
            logger.info(f"Availability request {request_obj.id} saved and email sent")
        else:
            logger.info(f"Availability request {request_obj.id} saved to database (email not configured)")
        
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
        
        # TODO: Send email notification (will be implemented when SMTP is configured)
        
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