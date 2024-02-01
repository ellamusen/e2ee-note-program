# Use the official Node.js LTS image as the base image
FROM oven/bun

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port that Next.js will run on
EXPOSE 3000

# Run the Next.js application
CMD ["bun", "run", "."]