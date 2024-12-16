#!/bin/bash

# Start the script
echo "--------------------------------------------------"
echo "Starting the setup and testing process"
echo "--------------------------------------------------"
echo ""

# Step 1: Run integrity tests
echo "Step 1: Performing integrity tests..."
npm run test --prefix /home/vagrant/
if [ $? -eq 0 ]; then
  echo "✔ Integrity tests passed successfully!"
else
  echo "✖ Integrity tests failed. Please check the errors above."
  exit 1
fi
echo ""

# Step 2: Set firewall rules to allow access on port 3000
echo "Step 2: Setting firewall rules to open access on port 3000..."
echo "    - Adding iptables rule..."
sudo iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
if [ $? -eq 0 ]; then
  echo "    ✔ iptables rule added successfully!"
else
  echo "    ✖ Failed to add iptables rule."
  exit 1
fi

echo "    - Configuring firewall for public network..."
sudo firewall-cmd --zone=public --add-port=3000/tcp --permanent
if [ $? -eq 0 ]; then
  echo "    ✔ Firewall rule added to public zone!"
else
  echo "    ✖ Failed to configure firewall for public zone."
  exit 1
fi

echo "    - Reloading firewall..."
sudo firewall-cmd --reload
if [ $? -eq 0 ]; then
  echo "    ✔ Firewall reloaded successfully!"
else
  echo "    ✖ Failed to reload the firewall."
  exit 1
fi
echo ""

# Step 3: Run the Node.js application
echo "Step 3: Starting the Node.js application..."
npm start --prefix /home/vagrant/
if [ $? -eq 0 ]; then
  echo "✔ Node.js application started successfully!"
else
  echo "✖ Failed to start the Node.js application. Please check the errors above."
  exit 1
fi
