import { getConnect } from "../config/db.js";

// Existing prompt functions
export async function getAllPrompt() {
    const pool = await getConnect();
    const result = await pool.request()
    .query("SELECT * FROM UsersP");

    return result.recordset;
}

export async function createPrompt(name, UserPrompt, llmPrompt ){
    const pool = await getConnect();
    await pool.request()
    .input("name", name)
    .input("UserPrompt", UserPrompt)
    .input("llmPrompt", llmPrompt)
    .query("INSERT INTO UsersP (name, UserPrompt, llmPrompt) VALUES (@name, @UserPrompt, @llmPrompt)");
}

export async function updatePrompt(id, name, UserPrompt, llmPrompt) {
    const pool = await getConnect();
    await pool.request()
    .input("id", id)
    .input("name", name)
    .input("UserPrompt", UserPrompt)
    .input("llmPrompt", llmPrompt)
    .query("UPDATE UsersP SET name=@name, UserPrompt=@UserPrompt, llmPrompt=@llmPrompt WHERE id=@id");
}

export async function deletePrompt(id) {
    const pool = await getConnect();
    await pool.request()
    .input("id", id)
    .query("DELETE FROM UsersP WHERE id=@id");
}

// Enhanced website generation functions with separate HTML, CSS, JS storage

export async function createWebsite(name, description, prompt, htmlCode, cssCode, jsCode, subdomain, deployPath) {
    const pool = await getConnect();
    const result = await pool.request()
        .input("name", name)
        .input("description", description)
        .input("prompt", prompt)
        .input("htmlCode", htmlCode)
        .input("cssCode", cssCode || '')
        .input("jsCode", jsCode || '')
        .input("subdomain", subdomain)
        .input("deployPath", deployPath)
        .input("isDeployed", true)
        .input("createdAt", new Date())
        .input("updatedAt", new Date())
        .query(`INSERT INTO Websites (name, description, prompt, htmlCode, cssCode, jsCode, subdomain, deployPath, isDeployed, createdAt, updatedAt) 
                OUTPUT INSERTED.id
                VALUES (@name, @description, @prompt, @htmlCode, @cssCode, @jsCode, @subdomain, @deployPath, @isDeployed, @createdAt, @updatedAt)`);
    
    return result.recordset[0].id;
}

export async function updateWebsite(id, name, description, prompt, htmlCode, cssCode, jsCode) {
    const pool = await getConnect();
    await pool.request()
        .input("id", id)
        .input("name", name)
        .input("description", description)
        .input("prompt", prompt)
        .input("htmlCode", htmlCode)
        .input("cssCode", cssCode || '')
        .input("jsCode", jsCode || '')
        .input("updatedAt", new Date())
        .query(`UPDATE Websites 
                SET name=@name, description=@description, prompt=@prompt, 
                    htmlCode=@htmlCode, cssCode=@cssCode, jsCode=@jsCode, updatedAt=@updatedAt 
                WHERE id=@id`);
}

export async function updateWebsiteDeployment(id, subdomain, deployPath) {
    const pool = await getConnect();
    await pool.request()
        .input("id", id)
        .input("subdomain", subdomain)
        .input("deployPath", deployPath)
        .input("isDeployed", true)
        .input("updatedAt", new Date())
        .query(`UPDATE Websites 
                SET subdomain=@subdomain, deployPath=@deployPath, isDeployed=@isDeployed, updatedAt=@updatedAt 
                WHERE id=@id`);
}

export async function getWebsiteById(id) {
    const pool = await getConnect();
    const result = await pool.request()
        .input("id", id)
        .query("SELECT * FROM Websites WHERE id=@id");
    
    return result.recordset[0];
}

export async function getAllWebsites() {
    const pool = await getConnect();
    const result = await pool.request()
        .query(`SELECT id, name, description, prompt, subdomain, deployPath, isDeployed, createdAt, updatedAt 
                FROM Websites 
                ORDER BY updatedAt DESC`);
    
    return result.recordset;
}

export async function deleteWebsite(id) {
    const pool = await getConnect();
    await pool.request()
        .input("id", id)
        .query("DELETE FROM Websites WHERE id=@id");
}

export async function getWebsiteBySubdomain(subdomain) {
    const pool = await getConnect();
    const result = await pool.request()
        .input("subdomain", subdomain)
        .query("SELECT * FROM Websites WHERE subdomain=@subdomain");
    
    return result.recordset[0];
}

export async function getDeployedWebsites() {
    const pool = await getConnect();
    const result = await pool.request()
        .query(`SELECT id, name, description, subdomain, deployPath, createdAt, updatedAt 
                FROM Websites 
                WHERE isDeployed=1 
                ORDER BY updatedAt DESC`);
    
    return result.recordset;
}