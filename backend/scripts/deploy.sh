#!/bin/bash

# Shakes Travel Backend Deployment Script
# Comprehensive deployment script for various environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="shakes-travel"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-}"
VERSION="${VERSION:-latest}"
ENVIRONMENT="${ENVIRONMENT:-development}"

echo -e "${BLUE}=========================================="
echo -e "🚀 Shakes Travel Backend Deployment"
echo -e "Environment: ${ENVIRONMENT}"
echo -e "Version: ${VERSION}"
echo -e "==========================================${NC}"

# Function to print colored messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Validate environment
validate_environment() {
    print_message "Validating deployment environment..."
    
    # Check Docker
    if ! command_exists docker; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Using default environment variables."
        
        # Create basic .env file
        cat > .env << EOF
NODE_ENV=${ENVIRONMENT}
PORT=5000
MONGODB_URI=mongodb://shakestravel:password123@mongodb:27017/shakestravel?authSource=shakestravel
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
EOF
        print_message "Created basic .env file"
    fi
    
    print_message "Environment validation completed"
}

# Build Docker images
build_images() {
    print_message "Building Docker images..."
    
    # Build production image
    print_message "Building production image..."
    docker build -t ${PROJECT_NAME}-backend:${VERSION} .
    
    # Build development image if in development
    if [ "$ENVIRONMENT" = "development" ]; then
        print_message "Building development image..."
        docker build -f Dockerfile.dev -t ${PROJECT_NAME}-backend:dev .
    fi
    
    print_message "Docker images built successfully"
}

# Tag and push images (if registry is specified)
push_images() {
    if [ -n "$DOCKER_REGISTRY" ]; then
        print_message "Tagging and pushing images to registry..."
        
        docker tag ${PROJECT_NAME}-backend:${VERSION} ${DOCKER_REGISTRY}/${PROJECT_NAME}-backend:${VERSION}
        docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-backend:${VERSION}
        
        if [ "$ENVIRONMENT" = "development" ]; then
            docker tag ${PROJECT_NAME}-backend:dev ${DOCKER_REGISTRY}/${PROJECT_NAME}-backend:dev
            docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-backend:dev
        fi
        
        print_message "Images pushed to registry successfully"
    else
        print_message "No registry specified, skipping push"
    fi
}

# Deploy based on environment
deploy() {
    print_message "Deploying to ${ENVIRONMENT} environment..."
    
    case $ENVIRONMENT in
        "development")
            deploy_development
            ;;
        "production")
            deploy_production
            ;;
        "sharding")
            deploy_sharding
            ;;
        *)
            print_error "Unknown environment: $ENVIRONMENT"
            print_message "Supported environments: development, production, sharding"
            exit 1
            ;;
    esac
}

# Development deployment
deploy_development() {
    print_message "Starting development environment..."
    
    # Stop existing containers
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml --profile development down
    
    # Start services
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml --profile development up -d
    
    print_message "Development environment started"
    print_message "API: http://localhost:5000"
    print_message "Mongo Express: http://localhost:8081"
    print_message "Redis Commander: http://localhost:8082"
}

# Production deployment
deploy_production() {
    print_message "Starting production environment..."
    
    # Stop existing containers
    docker-compose --profile production down
    
    # Start services
    docker-compose --profile production up -d
    
    print_message "Production environment started"
    print_message "API: http://localhost:5000"
    print_message "Load Balancer: http://localhost:80"
}

# Sharded MongoDB deployment
deploy_sharding() {
    print_message "Starting sharded MongoDB environment..."
    
    # Stop existing containers
    docker-compose -f docker-compose.sharding.yml down
    
    # Start sharded cluster
    docker-compose -f docker-compose.sharding.yml up -d
    
    # Wait for initialization
    print_message "Waiting for sharded cluster initialization..."
    sleep 60
    
    print_message "Sharded environment started"
    print_message "API: Connect to mongodb://root:shakestravelroot2024@localhost:27030,localhost:27031/?authSource=admin"
    print_message "Mongo Express: http://localhost:8081"
}

# Health check
health_check() {
    print_message "Performing health check..."
    
    # Wait for services to be ready
    sleep 30
    
    # Check API health
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        print_message "✅ API health check passed"
    else
        print_warning "⚠️  API health check failed - service may still be starting"
    fi
    
    # Check MongoDB
    if docker-compose exec -T mongodb mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
        print_message "✅ MongoDB health check passed"
    else
        print_warning "⚠️  MongoDB health check failed"
    fi
    
    # Check Redis
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        print_message "✅ Redis health check passed"
    else
        print_warning "⚠️  Redis health check failed"
    fi
}

# Cleanup function
cleanup() {
    print_message "Cleaning up..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful in production)
    if [ "$ENVIRONMENT" = "development" ]; then
        docker volume prune -f
    fi
    
    print_message "Cleanup completed"
}

# Show deployment status
show_status() {
    print_message "Deployment status:"
    
    # Show running containers
    docker-compose ps
    
    # Show logs (last 20 lines)
    echo ""
    print_message "Recent logs:"
    docker-compose logs --tail=20
}

# Main deployment flow
main() {
    case "${1:-deploy}" in
        "validate")
            validate_environment
            ;;
        "build")
            validate_environment
            build_images
            ;;
        "push")
            validate_environment
            build_images
            push_images
            ;;
        "deploy")
            validate_environment
            build_images
            push_images
            deploy
            health_check
            show_status
            ;;
        "health")
            health_check
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "down")
            print_message "Stopping all services..."
            docker-compose down
            docker-compose -f docker-compose.dev.yml down
            docker-compose -f docker-compose.sharding.yml down
            print_message "All services stopped"
            ;;
        *)
            echo "Usage: $0 {validate|build|push|deploy|health|status|cleanup|down}"
            echo ""
            echo "Commands:"
            echo "  validate  - Validate deployment environment"
            echo "  build     - Build Docker images"
            echo "  push      - Build and push images to registry"
            echo "  deploy    - Full deployment (build, push, deploy, health check)"
            echo "  health    - Run health checks"
            echo "  status    - Show deployment status"
            echo "  cleanup   - Clean up unused Docker resources"
            echo "  down      - Stop all services"
            echo ""
            echo "Environment Variables:"
            echo "  ENVIRONMENT     - Deployment environment (development|production|sharding)"
            echo "  VERSION         - Docker image version tag (default: latest)"
            echo "  DOCKER_REGISTRY - Docker registry URL (optional)"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"