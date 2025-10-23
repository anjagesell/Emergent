#!/usr/bin/env python3
"""
Backend API Testing for OCTA Care Services
Tests job application endpoints and existing availability request endpoints
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://octa-care-platform.preview.emergentagent.com/api"

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
            required_fields = ["id", "name", "email", "phone", "position", "about_yourself", "qualifications", "empathic_abilities", "number_of_children", "why_work_here", "timestamp", "language"]
            missing_fields = [field for field in required_fields if field not in response_data]
            
            if missing_fields:
                print(f"❌ FAIL: Missing fields in response: {missing_fields}")
                return False, None
            
            # Verify data matches input (enhanced fields)
            for field in ["name", "email", "phone", "position", "about_yourself", "qualifications", "empathic_abilities", "number_of_children", "why_work_here", "language"]:
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
                required_fields = ["id", "name", "email", "phone", "position", "about_yourself", "qualifications", "empathic_abilities", "number_of_children", "why_work_here", "timestamp", "language"]
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
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests for OCTA Care Services")
    print("🎯 Focus: Testing Fixed PATCH Endpoints for Notizen Field Issue")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {}
    
    # First ensure we have data to test with
    results['post_availability_request'] = test_post_availability_request()
    results['post_job_application'], created_job_id = test_post_job_application()
    
    # Get existing IDs for PATCH testing
    availability_ids, job_application_ids = get_existing_ids()
    
    # Test PATCH endpoints (main focus of this test)
    if availability_ids:
        results['patch_availability_request'] = test_patch_availability_request(availability_ids[0])
    else:
        print("⚠️  No availability requests found for PATCH testing")
        results['patch_availability_request'] = False
    
    if job_application_ids:
        results['patch_job_application'] = test_patch_job_application(job_application_ids[0])
    else:
        print("⚠️  No job applications found for PATCH testing")
        results['patch_job_application'] = False
    
    # Test GET endpoints to ensure they still work
    results['get_availability_requests'] = test_get_availability_requests()
    results['get_job_applications'] = test_get_job_applications()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY - PATCH ENDPOINTS FIX")
    print("="*60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    # Focus on PATCH endpoint results
    patch_tests = ['patch_availability_request', 'patch_job_application']
    patch_passed = sum(1 for test in patch_tests if results.get(test, False))
    
    print(f"\n🎯 PATCH Endpoints: {patch_passed}/{len(patch_tests)} passed")
    
    if patch_passed == len(patch_tests):
        print("🎉 PATCH endpoints fix verified - Notizen field issue resolved!")
        return 0
    else:
        print("⚠️  PATCH endpoints still have issues!")
        return 1

if __name__ == "__main__":
    sys.exit(main())