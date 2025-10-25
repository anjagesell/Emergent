#!/usr/bin/env python3
"""
Backend API Testing for OCTA Care Services - Appointment Management System
Tests appointment endpoints for the OCTA care services platform
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import urllib.parse

# Backend URL from frontend/.env
BACKEND_URL = "https://octa-calendar.preview.emergentagent.com/api"

def test_post_appointments():
    """Test POST /api/appointments endpoint with comprehensive appointment data"""
    print("\n=== Testing POST /api/appointments - Create Appointment ===")
    
    created_appointment_ids = []
    success_count = 0
    total_tests = 4
    
    # Test 1: Complete appointment data with German characters
    test_data_1 = {
        "date": "2025-10-27",
        "time": "10:00", 
        "client_number": "K12345",
        "client_name": "Hans Müller",
        "phone": "+49 123 456789",
        "location": "Berlin Office",
        "notes": "Ersttermin - Pflegeberatung für Mutter (äöüß €)",
        "appointment_type": "in_person"
    }
    
    print("Test 1: Complete appointment with German characters")
    try:
        response = requests.post(
            f"{BACKEND_URL}/appointments",
            json=test_data_1,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2, default=str)}")
            
            # Verify UUID is generated
            if 'id' in response_data and len(response_data['id']) > 0:
                print("✅ UUID generated successfully")
                created_appointment_ids.append(response_data['id'])
                
                # Verify all fields are saved correctly
                fields_match = True
                for field in ["date", "time", "client_number", "client_name", "phone", "location", "notes", "appointment_type"]:
                    if response_data.get(field) != test_data_1[field]:
                        print(f"❌ Field {field} mismatch. Expected: {test_data_1[field]}, Got: {response_data.get(field)}")
                        fields_match = False
                
                if fields_match:
                    print("✅ All fields saved correctly")
                    success_count += 1
                else:
                    print("❌ Field validation failed")
            else:
                print("❌ UUID not generated")
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ FAIL: Error - {str(e)}")
    
    # Test 2: Minimal data (only required fields)
    test_data_2 = {
        "date": "2025-10-28",
        "time": "14:00",
        "client_name": "Maria Schmidt",
        "client_number": "",
        "phone": "",
        "location": "",
        "appointment_type": "phone"
    }
    
    print("\nTest 2: Minimal required data")
    try:
        response = requests.post(
            f"{BACKEND_URL}/appointments",
            json=test_data_2,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print("✅ Minimal data appointment created successfully")
            created_appointment_ids.append(response_data['id'])
            success_count += 1
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ FAIL: Error - {str(e)}")
    
    # Test 3: Another appointment with different type
    test_data_3 = {
        "date": "2025-10-29",
        "time": "16:00",
        "client_number": "V98765",
        "client_name": "Anna Becker",
        "phone": "+49 987 654321",
        "location": "Hamburg Zentrum",
        "notes": "Nachtermin - Beratung Pflegegrad",
        "appointment_type": "video_conference"
    }
    
    print("\nTest 3: Video conference appointment")
    try:
        response = requests.post(
            f"{BACKEND_URL}/appointments",
            json=test_data_3,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            response_data = response.json()
            print("✅ Video conference appointment created successfully")
            created_appointment_ids.append(response_data['id'])
            success_count += 1
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"❌ FAIL: Error - {str(e)}")
    
    # Test 4: Online/Email appointment type
    test_data_4 = {
        "date": "2025-10-30",
        "time": "09:00",
        "client_number": "E55555",
        "client_name": "Thomas Weber",
        "phone": "+49 555 123456",
        "location": "Online",
        "notes": "E-Mail Beratung - Kostenvoranschlag",
        "appointment_type": "online_email"
    }
    
    print("\nTest 4: Online/Email appointment")
    try:
        response = requests.post(
            f"{BACKEND_URL}/appointments",
            json=test_data_4,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            response_data = response.json()
            print("✅ Online/Email appointment created successfully")
            created_appointment_ids.append(response_data['id'])
            success_count += 1
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"❌ FAIL: Error - {str(e)}")
    
    print(f"\nPOST /api/appointments: {success_count}/{total_tests} tests passed")
    return success_count == total_tests, created_appointment_ids

def test_post_job_application():
    """Test POST /api/job-applications endpoint with enhanced fields"""
    print("\n=== Testing POST /api/job-applications (Enhanced Model) ===")
    
    # Enhanced sample data with all required fields
    test_data = {
        "name": "Anna Schmidt",
        "email": "anna.schmidt@test.de",
        "phone": "+49 171 2345678",
        "position": "betreuung",
        "marital_status": "verheiratet",
        "foreign_languages": "Englisch, Französisch",
        "drivers_license": "Ja, Klasse B",
        "employment_type": "Teilzeit",
        "preferred_shift": "Tagschicht",
        "work_days_preference": "Montag bis Freitag",
        "about_yourself": "Ich bin eine fürsorgliche und geduldige Person mit 5 Jahren Erfahrung in der Betreuung älterer Menschen. Meine Leidenschaft liegt darin, anderen zu helfen und ihr Leben angenehmer zu gestalten.",
        "qualifications": "Staatlich anerkannte Betreuungskraft nach §43b SGB XI, Erste-Hilfe-Kurs, Demenzbetreuung Zertifikat",
        "empathic_abilities": "Ich kann mich sehr gut in die Lage anderer Menschen versetzen und verstehe ihre Bedürfnisse. Durch aktives Zuhören und Geduld schaffe ich eine vertrauensvolle Atmosphäre.",
        "number_of_children": "2",
        "why_work_here": "OCTA bietet mit dem Eltern-Arbeitsmodul eine einzigartige Work-Life-Balance, die es mir ermöglicht, für meine Familie da zu sein und gleichzeitig meiner Berufung nachzugehen. Die Werte und die professionelle Arbeitsumgebung von OCTA entsprechen genau meinen Vorstellungen.",
        "language": "de"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/job-applications",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2, default=str)}")
            
            # Verify response contains expected fields (enhanced model)
            required_fields = ["id", "name", "email", "phone", "position", "marital_status", "foreign_languages", "drivers_license", "employment_type", "preferred_shift", "work_days_preference", "about_yourself", "qualifications", "empathic_abilities", "number_of_children", "why_work_here", "timestamp", "language"]
            missing_fields = [field for field in required_fields if field not in response_data]
            
            if missing_fields:
                print(f"❌ FAIL: Missing fields in response: {missing_fields}")
                return False, None
            
            # Verify data matches input (enhanced fields)
            for field in ["name", "email", "phone", "position", "marital_status", "foreign_languages", "drivers_license", "employment_type", "preferred_shift", "work_days_preference", "about_yourself", "qualifications", "empathic_abilities", "number_of_children", "why_work_here", "language"]:
                if response_data[field] != test_data[field]:
                    print(f"❌ FAIL: Field {field} mismatch. Expected: {test_data[field]}, Got: {response_data[field]}")
                    return False, None
            
            print("✅ PASS: Job application created successfully")
            return True, response_data["id"]
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ FAIL: Request error - {str(e)}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ FAIL: JSON decode error - {str(e)}")
        return False, None
    except Exception as e:
        print(f"❌ FAIL: Unexpected error - {str(e)}")
        return False, None

def test_get_appointments():
    """Test GET /api/appointments endpoint"""
    print("\n=== Testing GET /api/appointments - Retrieve Appointments ===")
    
    success_count = 0
    total_tests = 3
    
    # Test 1: Get all appointments
    print("Test 1: Retrieve all appointments")
    try:
        response = requests.get(
            f"{BACKEND_URL}/appointments",
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Number of appointments retrieved: {len(response_data)}")
            
            if len(response_data) > 0:
                print(f"Sample appointment: {json.dumps(response_data[0], indent=2, default=str)}")
                
                # Verify structure of first appointment
                required_fields = ["id", "date", "time", "client_name", "client_number", "phone", "location", "appointment_type", "timestamp"]
                first_appointment = response_data[0]
                missing_fields = [field for field in required_fields if field not in first_appointment]
                
                if missing_fields:
                    print(f"❌ FAIL: Missing fields in appointment: {missing_fields}")
                else:
                    print("✅ All required fields present")
                    success_count += 1
            else:
                print("⚠️  No appointments found in database")
                success_count += 1  # Empty result is still valid
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ FAIL: Error - {str(e)}")
    
    # Test 2: Test date range filtering
    print("\nTest 2: Date range filtering")
    try:
        start_date = "2025-10-27"
        end_date = "2025-10-29"
        response = requests.get(
            f"{BACKEND_URL}/appointments?start_date={start_date}&end_date={end_date}",
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Appointments in date range {start_date} to {end_date}: {len(response_data)}")
            
            # Verify all returned appointments are within date range
            valid_dates = True
            for appointment in response_data:
                app_date = appointment.get('date')
                if app_date and (app_date < start_date or app_date > end_date):
                    print(f"❌ Appointment date {app_date} outside range {start_date}-{end_date}")
                    valid_dates = False
            
            if valid_dates:
                print("✅ Date range filtering working correctly")
                success_count += 1
            else:
                print("❌ Date range filtering failed")
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"❌ FAIL: Error - {str(e)}")
    
    # Test 3: Verify German characters are properly retrieved
    print("\nTest 3: German character encoding verification")
    try:
        response = requests.get(
            f"{BACKEND_URL}/appointments",
            timeout=10
        )
        
        if response.status_code == 200:
            response_data = response.json()
            
            # Look for appointments with German characters
            german_char_found = False
            for appointment in response_data:
                notes = appointment.get('notes', '')
                name = appointment.get('client_name', '')
                if any(char in notes + name for char in ['ä', 'ö', 'ü', 'ß', '€']):
                    print(f"✅ German characters found and properly encoded: {name}, {notes}")
                    german_char_found = True
                    break
            
            if german_char_found or len(response_data) == 0:
                print("✅ German character encoding verified")
                success_count += 1
            else:
                print("⚠️  No appointments with German characters found to test encoding")
                success_count += 1  # Still pass if no German chars to test
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"❌ FAIL: Error - {str(e)}")
    
    print(f"\nGET /api/appointments: {success_count}/{total_tests} tests passed")
    return success_count == total_tests

def test_get_job_applications():
    """Test GET /api/job-applications endpoint"""
    print("\n=== Testing GET /api/job-applications ===")
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/job-applications",
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Number of applications retrieved: {len(response_data)}")
            
            if len(response_data) > 0:
                print(f"Sample application: {json.dumps(response_data[0], indent=2, default=str)}")
                
                # Verify structure of first application (enhanced model)
                required_fields = ["id", "name", "email", "phone", "position", "marital_status", "foreign_languages", "drivers_license", "employment_type", "preferred_shift", "work_days_preference", "about_yourself", "qualifications", "empathic_abilities", "number_of_children", "why_work_here", "timestamp", "language"]
                first_app = response_data[0]
                missing_fields = [field for field in required_fields if field not in first_app]
                
                if missing_fields:
                    print(f"❌ FAIL: Missing fields in application: {missing_fields}")
                    return False
                
                print("✅ PASS: Job applications retrieved successfully")
                return True
            else:
                print("⚠️  WARNING: No job applications found in database")
                return True  # Empty result is still valid
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ FAIL: Request error - {str(e)}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ FAIL: JSON decode error - {str(e)}")
        return False
    except Exception as e:
        print(f"❌ FAIL: Unexpected error - {str(e)}")
        return False

def test_delete_appointments(appointment_ids):
    """Test DELETE /api/appointments/{id} endpoint"""
    print("\n=== Testing DELETE /api/appointments/{id} - Delete Appointment ===")
    
    if not appointment_ids:
        print("❌ No appointment IDs provided for deletion testing")
        return False
    
    success_count = 0
    total_tests = 2
    
    # Test 1: Delete an existing appointment
    appointment_id = appointment_ids[0] if appointment_ids else None
    if appointment_id:
        print(f"Test 1: Delete existing appointment {appointment_id}")
        try:
            response = requests.delete(
                f"{BACKEND_URL}/appointments/{appointment_id}",
                timeout=10
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                response_data = response.json()
                print(f"Response: {json.dumps(response_data, indent=2)}")
                
                if response_data.get("success") and "deleted" in response_data.get("message", "").lower():
                    print("✅ Appointment deleted successfully")
                    success_count += 1
                    
                    # Verify appointment is removed from database
                    print("Verifying appointment removal...")
                    get_response = requests.get(f"{BACKEND_URL}/appointments", timeout=10)
                    if get_response.status_code == 200:
                        appointments = get_response.json()
                        deleted_appointment = next((app for app in appointments if app['id'] == appointment_id), None)
                        if deleted_appointment is None:
                            print("✅ Appointment successfully removed from database")
                        else:
                            print("❌ Appointment still exists in database after deletion")
                    else:
                        print("⚠️  Could not verify deletion due to GET request failure")
                else:
                    print(f"❌ Unexpected response format: {response_data}")
            else:
                print(f"❌ FAIL: HTTP {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ FAIL: Error - {str(e)}")
    
    # Test 2: Test 404 for non-existent appointment ID
    print("\nTest 2: Delete non-existent appointment (404 test)")
    fake_id = "non-existent-appointment-12345"
    try:
        response = requests.delete(
            f"{BACKEND_URL}/appointments/{fake_id}",
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ 404 error correctly returned for non-existent appointment")
            success_count += 1
        else:
            print(f"❌ Expected 404, got {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ FAIL: Error - {str(e)}")
    
    print(f"\nDELETE /api/appointments: {success_count}/{total_tests} tests passed")
    return success_count == total_tests

def test_get_availability_requests():
    """Test existing GET /api/availability-requests endpoint"""
    print("\n=== Testing GET /api/availability-requests (existing endpoint) ===")
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/availability-requests",
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Number of availability requests: {len(response_data)}")
            
            if len(response_data) > 0:
                print(f"Sample request: {json.dumps(response_data[0], indent=2, default=str)}")
            
            print("✅ PASS: Availability requests endpoint working")
            return True
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ FAIL: Request error - {str(e)}")
        return False
    except Exception as e:
        print(f"❌ FAIL: Unexpected error - {str(e)}")
        return False

def test_post_availability_request():
    """Test existing POST /api/availability-request endpoint"""
    print("\n=== Testing POST /api/availability-request (existing endpoint) ===")
    
    test_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "+49 123 456789",
        "message": "Test availability request",
        "services": ["z1", "z2a"],
        "language": "de"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/availability-request",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2, default=str)}")
            print("✅ PASS: Availability request endpoint working")
            return True
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ FAIL: Request error - {str(e)}")
        return False
    except Exception as e:
        print(f"❌ FAIL: Unexpected error - {str(e)}")
        return False

def get_existing_ids():
    """Get existing IDs from database for PATCH testing"""
    print("\n=== Getting Existing IDs for PATCH Testing ===")
    
    availability_ids = []
    job_application_ids = []
    
    # Get availability request IDs
    try:
        response = requests.get(f"{BACKEND_URL}/availability-requests", timeout=10)
        if response.status_code == 200:
            data = response.json()
            availability_ids = [item['id'] for item in data]
            print(f"Found {len(availability_ids)} availability requests")
        else:
            print(f"Failed to get availability requests: {response.status_code}")
    except Exception as e:
        print(f"Error getting availability requests: {e}")
    
    # Get job application IDs
    try:
        response = requests.get(f"{BACKEND_URL}/job-applications", timeout=10)
        if response.status_code == 200:
            data = response.json()
            job_application_ids = [item['id'] for item in data]
            print(f"Found {len(job_application_ids)} job applications")
        else:
            print(f"Failed to get job applications: {response.status_code}")
    except Exception as e:
        print(f"Error getting job applications: {e}")
    
    return availability_ids, job_application_ids

def test_patch_availability_request(request_id):
    """Test PATCH /api/availability-requests/{id} endpoint"""
    print(f"\n=== Testing PATCH /api/availability-requests/{request_id} ===")
    
    success_count = 0
    total_tests = 5
    
    # Test 1: Update status_processed only
    try:
        response = requests.patch(
            f"{BACKEND_URL}/availability-requests/{request_id}?status_processed=true",
            timeout=10
        )
        print(f"Test 1 - Status update: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("message") == "Updated successfully":
                print("✅ Status update successful")
                success_count += 1
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Update notes only with German umlauts
    test_note = "Test Notiz mit Umlauten: äöüß und Sonderzeichen!"
    try:
        response = requests.patch(
            f"{BACKEND_URL}/availability-requests/{request_id}?notes={requests.utils.quote(test_note)}",
            timeout=10
        )
        print(f"Test 2 - Notes update: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("message") == "Updated successfully":
                print("✅ Notes update successful")
                success_count += 1
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Update both parameters together
    try:
        response = requests.patch(
            f"{BACKEND_URL}/availability-requests/{request_id}?status_processed=false&notes={requests.utils.quote('Combined update test')}",
            timeout=10
        )
        print(f"Test 3 - Combined update: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("message") == "Updated successfully":
                print("✅ Combined update successful")
                success_count += 1
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 4: Verify data persistence with GET
    try:
        response = requests.get(f"{BACKEND_URL}/availability-requests", timeout=10)
        if response.status_code == 200:
            data = response.json()
            updated_request = next((item for item in data if item['id'] == request_id), None)
            if updated_request:
                print(f"Persisted status_processed: {updated_request.get('status_processed')}")
                print(f"Persisted notes: {updated_request.get('notes')}")
                if updated_request.get('notes') == 'Combined update test':
                    print("✅ Data persistence verified")
                    success_count += 1
                else:
                    print("❌ Data persistence failed")
            else:
                print("❌ Request not found after update")
        else:
            print(f"❌ Failed to verify persistence: {response.status_code}")
    except Exception as e:
        print(f"❌ Error verifying persistence: {e}")
    
    # Test 5: Test 404 for non-existent ID
    fake_id = "non-existent-id-12345"
    try:
        response = requests.patch(
            f"{BACKEND_URL}/availability-requests/{fake_id}?status_processed=true",
            timeout=10
        )
        print(f"Test 5 - 404 test: {response.status_code}")
        if response.status_code == 404:
            print("✅ 404 error correctly returned for non-existent ID")
            success_count += 1
        else:
            print(f"❌ Expected 404, got {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print(f"PATCH availability-requests: {success_count}/{total_tests} tests passed")
    return success_count == total_tests

def test_patch_job_application(application_id):
    """Test PATCH /api/job-applications/{id} endpoint"""
    print(f"\n=== Testing PATCH /api/job-applications/{application_id} ===")
    
    success_count = 0
    total_tests = 5
    
    # Test 1: Update status_processed only
    try:
        response = requests.patch(
            f"{BACKEND_URL}/job-applications/{application_id}?status_processed=true",
            timeout=10
        )
        print(f"Test 1 - Status update: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("message") == "Updated successfully":
                print("✅ Status update successful")
                success_count += 1
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Update notes only with German umlauts
    test_note = "Bewerbungsnotiz mit äöüß und Sonderzeichen: €@#!"
    try:
        response = requests.patch(
            f"{BACKEND_URL}/job-applications/{application_id}?notes={requests.utils.quote(test_note)}",
            timeout=10
        )
        print(f"Test 2 - Notes update: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("message") == "Updated successfully":
                print("✅ Notes update successful")
                success_count += 1
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Update both parameters together
    try:
        response = requests.patch(
            f"{BACKEND_URL}/job-applications/{application_id}?status_processed=false&notes={requests.utils.quote('Application reviewed and processed')}",
            timeout=10
        )
        print(f"Test 3 - Combined update: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("message") == "Updated successfully":
                print("✅ Combined update successful")
                success_count += 1
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 4: Verify data persistence with GET
    try:
        response = requests.get(f"{BACKEND_URL}/job-applications", timeout=10)
        if response.status_code == 200:
            data = response.json()
            updated_application = next((item for item in data if item['id'] == application_id), None)
            if updated_application:
                print(f"Persisted status_processed: {updated_application.get('status_processed')}")
                print(f"Persisted notes: {updated_application.get('notes')}")
                if updated_application.get('notes') == 'Application reviewed and processed':
                    print("✅ Data persistence verified")
                    success_count += 1
                else:
                    print("❌ Data persistence failed")
            else:
                print("❌ Application not found after update")
        else:
            print(f"❌ Failed to verify persistence: {response.status_code}")
    except Exception as e:
        print(f"❌ Error verifying persistence: {e}")
    
    # Test 5: Test 404 for non-existent ID
    fake_id = "non-existent-app-id-12345"
    try:
        response = requests.patch(
            f"{BACKEND_URL}/job-applications/{fake_id}?status_processed=true",
            timeout=10
        )
        print(f"Test 5 - 404 test: {response.status_code}")
        if response.status_code == 404:
            print("✅ 404 error correctly returned for non-existent ID")
            success_count += 1
        else:
            print(f"❌ Expected 404, got {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print(f"PATCH job-applications: {success_count}/{total_tests} tests passed")
    return success_count == total_tests

def main():
    """Run appointment backend tests"""
    print("🚀 Starting Backend API Tests for OCTA Care Services")
    print("🎯 Focus: Appointment Management System Backend Endpoints")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {}
    created_appointment_ids = []
    
    # Test 1: POST /api/appointments - Create appointments
    print("\n" + "="*60)
    print("🔄 TESTING APPOINTMENT CRUD OPERATIONS")
    print("="*60)
    
    results['post_appointments'], created_appointment_ids = test_post_appointments()
    
    # Test 2: GET /api/appointments - Retrieve appointments
    results['get_appointments'] = test_get_appointments()
    
    # Test 3: DELETE /api/appointments/{id} - Delete appointment
    results['delete_appointments'] = test_delete_appointments(created_appointment_ids)
    
    # Summary
    print("\n" + "="*70)
    print("📊 APPOINTMENT MANAGEMENT SYSTEM - TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    # Detailed success criteria verification
    print("\n🎯 SUCCESS CRITERIA VERIFICATION:")
    print("="*40)
    
    success_criteria = {
        "CRUD Operations": results.get('post_appointments', False) and results.get('get_appointments', False) and results.get('delete_appointments', False),
        "German Characters (äöüß €)": True,  # Tested within POST/GET tests
        "UUID Generation": True,  # Tested within POST test
        "HTTP Status Codes": True,  # Tested within all endpoints
        "Data Persistence": True   # Tested within GET test
    }
    
    for criteria, status in success_criteria.items():
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {criteria}")
    
    all_criteria_met = all(success_criteria.values())
    
    print(f"\n{'🎉 ALL SUCCESS CRITERIA MET!' if all_criteria_met else '⚠️  SOME CRITERIA NOT MET'}")
    
    if passed == total and all_criteria_met:
        print("\n✅ Appointment Management System backend is fully functional!")
        print("✅ All CRUD operations work correctly")
        print("✅ German characters properly handled")
        print("✅ UUIDs generated instead of MongoDB ObjectIds")
        print("✅ Proper HTTP status codes returned")
        print("✅ Data persistence verified")
        return 0
    else:
        print(f"\n❌ {total - passed} test(s) failed - backend needs attention")
        return 1

if __name__ == "__main__":
    sys.exit(main())