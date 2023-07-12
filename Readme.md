# RideEase App
RideEase is a ride-sharing application that provides convenient transportation services to users. It features user authentication with sign-up and login functionality, as well as a beautiful user dashboard to manage rides. Additionally, it offers an admin dashboard to view user data stored in a PostgreSQL database.

## Features
-  **User authentication:** Sign up and login to access the application.
-  **User dashboard:** Manage rides and view ride history.
-  **Admin dashboard:** View user data and perform administrative tasks.
- **PostgreSQL database:** Data storage for user information and ride data.

## Prerequisites
Before running the RideEase application, you need to set up a PostgreSQL server. You can choose to run it locally, in a Docker container, or in a Kubernetes cluster.

## Setting up PostgreSQL

**Local setup:** Install PostgreSQL on your local machine by following the official documentation: PostgreSQL Downloads.

## Docker setup
If you prefer running RideEase in a Docker container, ensure that Docker is installed on your machine. You can pull the RideEase Docker image from Docker Hub using the following command:

    docker pull ialexeze/rideease:user
    docker pull ialexeze/rideease:admin
    

**Launch the PostgreSQL container with the necessary environment variables and port mapping:**

    docker run -d --name postgresql -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgresl:alpine

**Launch the User and Admin container with the necessary environment variables and port mapping:**

    docker run -d --name user -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 ialexeze/rideease:user
    docker run -d --name admin -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 ialexeze/rideease:admin

## Kubernetes setup:
To deploy RideEase in a Kubernetes cluster, ensure you have kubectl installed and configured to access your cluster. Apply the Kubernetes manifest file to create the necessary resources:

    kubectl apply -f rideease-kubernetes.yaml

## Usage
Visit http://localhost:3000 in your browser.
Sign up for a new account or log in if you already have one.
After successful login, you will be redirected to the user dashboard.
Navigate to the admin dashboard to view user data and perform administrative tasks.

## Contributing
Contributions to RideEase are welcome! If you have any suggestions, improvements, or bug fixes, please open an issue or submit a pull request to the GitHub repository.

## License
RideEase is released under the MIT License. Feel free to use, modify, and distribute the code as per the terms of the license.

## Contributors:
Alex Eze
Esther Oluebube

Acknowledgements
RideEase utilizes various open-source libraries and frameworks. Special thanks to the contributors of the following projects:

Flask: Flask
SQLAlchemy: SQLAlchemy
Node.js: Node.js
Express: Express.js
PostgreSQL: PostgreSQL

## Contact
For any inquiries or support, please contact the RideEase development team at rideease@example.com.
