#!/bin/bash

# Script to run all tests for the Ethereum Paper Wallet Generator

# Set default environment variables
export NODE_ENV=test

# Set colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Ethereum Paper Wallet Generator Tests${NC}"
echo -e "${BLUE}=====================================${NC}"

# Check if node and npm are installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
fi

# Function to run tests and check results
run_tests() {
    local test_type=$1
    local test_command=$2
    
    echo -e "${BLUE}Running $test_type tests...${NC}"
    if npm run $test_command; then
        echo -e "${GREEN}✓ $test_type tests passed${NC}"
        return 0
    else
        echo -e "${RED}✗ $test_type tests failed${NC}"
        return 1
    fi
}

# Run all tests
echo -e "${BLUE}Running all tests...${NC}"

# Run unit tests
run_tests "Unit" "test:unit"
unit_result=$?

# Run integration tests
run_tests "Integration" "test:integration"
integration_result=$?

# Run end-to-end tests
run_tests "End-to-End" "test:e2e"
e2e_result=$?

# Print summary
echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}=====================================${NC}"

if [ $unit_result -eq 0 ]; then
    echo -e "${GREEN}✓ Unit tests passed${NC}"
else
    echo -e "${RED}✗ Unit tests failed${NC}"
fi

if [ $integration_result -eq 0 ]; then
    echo -e "${GREEN}✓ Integration tests passed${NC}"
else
    echo -e "${RED}✗ Integration tests failed${NC}"
fi

if [ $e2e_result -eq 0 ]; then
    echo -e "${GREEN}✓ End-to-End tests passed${NC}"
else
    echo -e "${RED}✗ End-to-End tests failed${NC}"
fi

# Exit with appropriate status code
if [ $unit_result -eq 0 ] && [ $integration_result -eq 0 ] && [ $e2e_result -eq 0 ]; then
    echo -e "${GREEN}All tests passed${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed${NC}"
    exit 1
fi 