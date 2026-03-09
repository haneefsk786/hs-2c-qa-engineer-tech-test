#!/bin/bash

# Test Report Generation Script
# This script runs all tests and saves the results for PR submission

echo "========================================"
echo "  Book Library - Test Report Generator"
echo "========================================"
echo ""

# Create reports directory
mkdir -p test-reports

# Run Unit Tests with coverage
echo "Running Unit Tests..."
echo "----------------------------------------"
npm run test -- --run --coverage 2>&1 | tee test-reports/unit-test-results.txt

# Extract summary
echo ""
echo "Unit Test Summary:"
tail -10 test-reports/unit-test-results.txt

# Run E2E Tests (Chromium only for speed)
echo ""
echo "Running E2E Tests (Chromium)..."
echo "----------------------------------------"
npx playwright test --project=chromium --reporter=list 2>&1 | tee test-reports/e2e-test-results.txt

# Generate HTML report
echo ""
echo "Generating HTML Report..."
npx playwright test --project=chromium --reporter=html 2>/dev/null

echo ""
echo "========================================"
echo "  Test Reports Generated!"
echo "========================================"
echo ""
echo "Reports saved to:"
echo "  - test-reports/unit-test-results.txt"
echo "  - test-reports/e2e-test-results.txt"
echo "  - playwright-report/index.html (view with: npx playwright show-report)"
echo "  - coverage/index.html (open in browser)"
echo ""
