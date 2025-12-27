#!/bin/bash

echo "Running tests with coverage..."
npm run test:coverage

echo ""
echo "Coverage report generated at: coverage/lcov.info"
echo ""

# Check if lcov.info exists
if [ -f "coverage/lcov.info" ]; then
    echo "✅ lcov.info file found!"
    echo "File size: $(wc -c < coverage/lcov.info) bytes"
    echo "Lines in lcov.info: $(wc -l < coverage/lcov.info)"
else
    echo "❌ lcov.info file not found!"
    exit 1
fi

echo ""
echo "SonarQube configuration:"
echo "- Project key: $(grep sonar.projectKey sonar-project.properties)"
echo "- Coverage path: $(grep sonar.javascript.lcov.reportPaths sonar-project.properties)"
echo ""
echo "You can now run SonarQube analysis with your configured scanner."
