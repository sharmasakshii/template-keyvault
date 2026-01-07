#!/bin/bash

# Define variables (adjust these according to your setup)
REMOTE_HOST="GS-amr-redis-dev-eastus-001.redis.cache.windows.net"
REMOTE_USER="default"
PRIVATE_KEY="/home/saurav/.ssh/id_rsa"
REMOTE_DIR="/path/to/remote/dir"
REDIS_PORTS=(7000 7001 7002)

# Function to execute remote commands using SSH
execute_remote_command() {
    local command=$1
    ssh -i "$PRIVATE_KEY" "$REMOTE_USER@$REMOTE_HOST" "$command"
}

# Function to flush a Redis node
flush_redis_node() {
    local port=$1
    echo "Flushing Redis node on port $port..."
    execute_remote_command "redis-cli -p $port FLUSHALL"
    echo "Redis node on port $port flushed."
}

# Function to reset the Redis cluster
reset_redis_cluster() {
    echo "Resetting Redis cluster..."
    execute_remote_command "redis-cli CLUSTER RESET HARD"
    echo "Redis cluster reset completed."
}

# Function to shutdown a Redis node
shutdown_redis_node() {
    local port=$1
    echo "Shutting down Redis node on port $port..."
    execute_remote_command "redis-cli -p $port SHUTDOWN"
    flush_redis_node $port
    echo "Redis node on port $port shut down."
}

# Function to delete existing Redis files for a node
delete_redis_files() {
    local port=$1
    local clusterConfigFile="${REMOTE_DIR}/nodes-${port}.conf"
    local logFile="${REMOTE_DIR}/${port}.log"
    local dbFile="${REMOTE_DIR}/dump-${port}.rdb"

    echo "Deleting existing Redis files for port $port..."
    execute_remote_command "rm -f $clusterConfigFile && rm -f $logFile && rm -f $dbFile"
    echo "Existing Redis files for port $port deleted."
}

# Function to setup a Redis node
setup_redis_node() {
    local port=$1
    delete_redis_files $port  # Delete existing files first
    local clusterConfigFile="${REMOTE_DIR}/nodes-${port}.conf"
    local logFile="${REMOTE_DIR}/${port}.log"

    echo "Setting up Redis node on port $port..."
    execute_remote_command "mkdir -p $REMOTE_DIR && echo '' > $clusterConfigFile && redis-server --port $port --cluster-enabled yes --cluster-config-file $clusterConfigFile --cluster-node-timeout 5000 --appendonly yes --logfile $logFile --daemonize yes"
    echo "Redis node on port $port started."
}

# Function to check if a Redis node is already running
is_redis_node_running() {
    local port=$1
    result=$(execute_remote_command "redis-cli -p $port ping")
    if [ "$result" == "PONG" ]; then
        return 0  # Redis node is running
    else
        return 1  # Redis node is not running
    fi
}

# Function to create the Redis cluster
create_redis_cluster() {
    nodes=""
    for port in "${REDIS_PORTS[@]}"; do
        nodes+="127.0.0.1:$port "
    done

    echo "Creating Redis cluster..."
    execute_remote_command "echo 'yes' | redis-cli --cluster create $nodes --cluster-replicas 0"
    echo "Redis cluster created successfully."
}

# Main function to setup the Redis cluster
setup_redis_cluster() {
    for port in "${REDIS_PORTS[@]}"; do
        if is_redis_node_running $port; then
            echo "Redis node on port $port is already running."
            flush_redis_node $port  # Flush the node
            reset_redis_cluster     # Reset the cluster
            shutdown_redis_node $port # Shutdown the node
        fi
        setup_redis_node $port  # Setup the Redis node
    done
    create_redis_cluster     # Create the cluster after setting up all nodes
    echo "Redis cluster setup completed successfully."
}

# Run the script
setup_redis_cluster
