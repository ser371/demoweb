-- File: src/schema/websiteSchema.sql
-- Enhanced Websites table for storing separate HTML, CSS, JS files and deployment info

-- Drop table if exists (for development)
-- DROP TABLE IF EXISTS WebsiteDeployments;
-- DROP TABLE IF EXISTS Websites;

-- Create Websites table
CREATE TABLE Websites (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(1000),
    prompt NVARCHAR(MAX) NOT NULL,
    htmlCode NVARCHAR(MAX) NOT NULL,
    cssCode NVARCHAR(MAX),
    jsCode NVARCHAR(MAX),
    subdomain NVARCHAR(100) UNIQUE,
    deployPath NVARCHAR(500),
    isDeployed BIT DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);

-- Create indexes for faster queries
CREATE INDEX IX_Websites_CreatedAt ON Websites(createdAt);
CREATE INDEX IX_Websites_Name ON Websites(name);
CREATE INDEX IX_Websites_Subdomain ON Websites(subdomain);
CREATE INDEX IX_Websites_IsDeployed ON Websites(isDeployed);

-- Optional: Create a table to track deployment history
CREATE TABLE WebsiteDeployments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    websiteId INT FOREIGN KEY REFERENCES Websites(id) ON DELETE CASCADE,
    version INT NOT NULL,
    deployedAt DATETIME2 DEFAULT GETDATE(),
    deployPath NVARCHAR(500),
    status NVARCHAR(50) DEFAULT 'active',
    subdomain NVARCHAR(100)
);

-- Create index for deployment history
CREATE INDEX IX_WebsiteDeployments_WebsiteId ON WebsiteDeployments(websiteId);
CREATE INDEX IX_WebsiteDeployments_Status ON WebsiteDeployments(status);