sudo apt-get update

# Check if Node.js is installed
if ! which node &> /dev/null
then
    echo "Node.js not found, installing..."
    sudo apt install nodejs -y
fi

# Check if npm is installed
if ! which npm &> /dev/null
then
    echo "npm not found, installing..."
    sudo apt install npm -y
fi

# Check if Docker is installed
if ! which docker &> /dev/null
then
    echo "Docker not found, installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh ./get-docker.sh -y
    sudo apt-get install docker-compose-plugin -y
fi

# Setup App 
mkdir -p ~/app
cd ~/app
if [ ! -d "CSC337_Final_Project" ]; then
    git clone https://github.com/Sneupi/CSC337_Final_Project.git
fi
cd CSC337_Final_Project
git checkout exp2
git pull

# Build and run the app
docker compose up -d --build
