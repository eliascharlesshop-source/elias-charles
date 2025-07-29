#!/bin/bash

# EC Store - Quick Development Startup
# Starts both web and mobile development servers

echo "🚀 EC Store - Development Startup"
echo "================================="
echo ""

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -i:$port > /dev/null 2>&1; then
        echo "⚠️  Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Function to start server in background
start_server() {
    local command=$1
    local name=$2
    local log_file=$3
    
    echo "🔄 Starting $name..."
    nohup $command > $log_file 2>&1 &
    local pid=$!
    echo "   PID: $pid"
    echo "   Log: $log_file"
    sleep 2
    
    if ps -p $pid > /dev/null; then
        echo "✅ $name started successfully"
        return 0
    else
        echo "❌ $name failed to start"
        return 1
    fi
}

# Check ports
echo "1. 🔍 Checking Port Availability"
echo "==============================="
web_port_ok=0
mobile_port_ok=0

check_port 3000 && web_port_ok=1
check_port 4200 && mobile_port_ok=1

echo ""

# Start web server
echo "2. 🌐 Starting Web Server (Next.js)"
echo "===================================="
if [ $web_port_ok -eq 1 ]; then
    if start_server "npm run dev" "Next.js Web Server" "web-server.log"; then
        web_started=1
    else
        web_started=0
    fi
else
    echo "❌ Cannot start web server - port 3000 in use"
    web_started=0
fi

echo ""

# Start mobile server
echo "3. 📱 Starting Mobile Server (React Native)"
echo "==========================================="
if [ $mobile_port_ok -eq 1 ]; then
    cd ec-mobile
    if start_server "npm run start" "React Native Mobile Server" "../mobile-server.log"; then
        mobile_started=1
    else
        mobile_started=0
    fi
    cd ..
else
    echo "❌ Cannot start mobile server - port 4200 in use"
    mobile_started=0
fi

echo ""

# Wait for servers to fully start
echo "4. ⏳ Waiting for Servers to Initialize..."
echo "=========================================="
sleep 5

# Verify servers are responding
echo "5. 🔍 Verifying Server Status"
echo "============================="

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Web server is responding at http://localhost:3000"
    web_working=1
else
    echo "❌ Web server is not responding"
    web_working=0
fi

if curl -s http://localhost:4200 > /dev/null 2>&1; then
    echo "✅ Mobile server is responding at http://localhost:4200"
    mobile_working=1
else
    echo "❌ Mobile server is not responding"
    mobile_working=0
fi

echo ""

# Summary
echo "📊 STARTUP SUMMARY"
echo "=================="
echo "🌐 Web Server (Next.js):"
echo "   Started: $([ $web_started -eq 1 ] && echo "✅" || echo "❌")"
echo "   Working: $([ $web_working -eq 1 ] && echo "✅" || echo "❌")"
echo "   URL: http://localhost:3000"

echo ""
echo "📱 Mobile Server (React Native):"
echo "   Started: $([ $mobile_started -eq 1 ] && echo "✅" || echo "❌")"
echo "   Working: $([ $mobile_working -eq 1 ] && echo "✅" || echo "❌")"
echo "   URL: http://localhost:4200"

echo ""

if [ $web_working -eq 1 ] && [ $mobile_working -eq 1 ]; then
    echo "🎉 Both servers are running successfully!"
    echo ""
    echo "🔗 Quick Links:"
    echo "   🌐 Web Store: http://localhost:3000"
    echo "   📱 Mobile App: http://localhost:4200"
    echo "   🛍️  Products: http://localhost:3000/collections"
    echo "   🧪 Test Product: http://localhost:3000/products/test_ec"
    echo ""
    echo "🛠️  Management:"
    echo "   📊 Verify Status: ./scripts.sh verify"
    echo "   🧪 Test Shopify: ./scripts.sh test-shopify"
    echo "   📋 View Logs: tail -f web-server.log mobile-server.log"
    echo "   🛑 Stop Servers: pkill -f 'npm run'"
elif [ $web_working -eq 1 ]; then
    echo "⚠️  Web server is working, but mobile server failed"
    echo "   🌐 Web Store: http://localhost:3000"
    echo "   📋 Check mobile logs: tail -f mobile-server.log"
elif [ $mobile_working -eq 1 ]; then
    echo "⚠️  Mobile server is working, but web server failed"
    echo "   📱 Mobile App: http://localhost:4200"
    echo "   📋 Check web logs: tail -f web-server.log"
else
    echo "❌ Both servers failed to start properly"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   📋 Check logs: tail -f web-server.log mobile-server.log"
    echo "   🔍 Check processes: ps aux | grep npm"
    echo "   🛑 Kill processes: pkill -f 'npm run'"
    echo "   ⚙️  Check dependencies: npm install"
fi

echo ""
echo "📁 Log Files Created:"
echo "   🌐 Web: web-server.log"
echo "   📱 Mobile: mobile-server.log"
