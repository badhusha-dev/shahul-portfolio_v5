#!/bin/bash

# Portfolio Docker Deployment Script
# This script helps deploy the portfolio application using Docker

set -e

echo "🚀 Starting Portfolio Docker Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Please update the .env file with your actual configuration before running again."
        exit 1
    else
        print_error ".env file not found and no .env.example available. Please create .env file with required configuration."
        exit 1
    fi
fi

# Function to build and start services
deploy() {
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    print_status "Starting services..."
    docker-compose up -d
    
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Services are running!"
        print_status "Frontend: http://localhost:2025"
    else
        print_error "Some services failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
}

# Function to deploy with optimized server files (for low disk space)
deploy_server() {
    print_status "Building optimized Docker images for server deployment..."
    
    # Check if optimized files exist
    if [ ! -f "docker-compose.server.yml" ]; then
        print_error "Optimized server files not found. Please ensure Dockerfile.server and docker-compose.server.yml exist."
        exit 1
    fi
    
    docker-compose -f docker-compose.server.yml build --no-cache
    
    print_status "Starting optimized services..."
    docker-compose -f docker-compose.server.yml up -d
    
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check if services are running
    if docker-compose -f docker-compose.server.yml ps | grep -q "Up"; then
        print_success "Optimized services are running!"
        print_status "Frontend: http://localhost:2025"
    else
        print_error "Some services failed to start. Check logs with: docker-compose -f docker-compose.server.yml logs"
        exit 1
    fi
}

# Function to clean up Docker system (for disk space issues)
cleanup_docker() {
    print_status "Performing aggressive Docker cleanup..."
    
    # Stop all containers
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.server.yml down 2>/dev/null || true
    
    # Remove all unused resources
    docker system prune -a --volumes -f
    docker builder prune -a -f
    docker image prune -a -f
    docker container prune -f
    docker volume prune -f
    
    print_success "Docker cleanup completed!"
    print_status "Disk space freed up. You can now try deployment again."
}

# Function to stop services
stop() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped!"
}

# Function to view logs
logs() {
    print_status "Showing logs..."
    docker-compose logs -f
}

# Function to restart services
restart() {
    print_status "Restarting services..."
    docker-compose restart
    print_success "Services restarted!"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    print_success "Cleanup completed!"
}

# Function to show status
status() {
    print_status "Service Status:"
    docker-compose ps
}

# Function to show help
show_help() {
    echo "Portfolio Docker Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy        Build and start all services (standard)"
    echo "  deploy-server Build and start services with optimized server files"
    echo "  cleanup-docker Perform aggressive Docker cleanup for disk space issues"
    echo "  stop          Stop all services"
    echo "  restart       Restart all services"
    echo "  logs          Show logs from all services"
    echo "  status        Show status of all services"
    echo "  cleanup       Stop services and clean up Docker resources"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy-server    # Deploy with optimized server files (recommended for low disk space)"
    echo "  $0 cleanup-docker   # Clean up Docker system if running out of disk space"
    echo "  $0 deploy           # Standard deployment"
    echo "  $0 logs             # View logs"
    echo "  $0 status           # Check service status"
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    deploy-server)
        deploy_server
        ;;
    cleanup-docker)
        cleanup_docker
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
