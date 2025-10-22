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
BACKEND_URL = "https://octa-pflege.preview.emergentagent.com/api"

def test_post_job_application():
    """Test POST /api/job-applications endpoint"""
    print("\n=== Testing POST /api/job-applications ===")
    
    # Sample data as specified in the review request
    test_data = {
        "name": "Max Mustermann",
        "email": "max@test.de",
        "phone": "+49 123 456789",
        "position": "pflege",
        "message": "Ich bin sehr interessiert an der Position als Pflegefachkraft.",
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
            
            # Verify response contains expected fields
            required_fields = ["id", "name", "email", "phone", "position", "message", "timestamp", "language"]
            missing_fields = [field for field in required_fields if field not in response_data]
            
            if missing_fields:
                print(f"❌ FAIL: Missing fields in response: {missing_fields}")
                return False, None
            
            # Verify data matches input
            for field in ["name", "email", "phone", "position", "message", "language"]:
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
                
                # Verify structure of first application
                required_fields = ["id", "name", "email", "phone", "position", "timestamp", "language"]
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

def main():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests for OCTA Care Services")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {}
    
    # Test job application endpoints (main focus)
    results['post_job_application'], created_id = test_post_job_application()
    results['get_job_applications'] = test_get_job_applications()
    
    # Test existing endpoints to ensure they still work
    results['get_availability_requests'] = test_get_availability_requests()
    results['post_availability_request'] = test_post_availability_request()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())