// File: src/schema/setupDatabase.js
// Database setup script to create tables programmatically

import { getConnect } from "../../config/db.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupDatabase() {
    try {
        const pool = await getConnect();
        
        // Read the schema file
        const schemaPath = path.join(__dirname, 'websiteSchema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        
        // Split by GO statements and execute each batch
        const statements = schema.split(/\s*GO\s*/gi).filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await pool.request().query(statement);
                console.log('Executed:', statement.substring(0, 50) + '...');
            }
        }
        
        console.log('Database setup completed successfully!');
        
    } catch (err) {
        console.error('Database setup failed:', err.message);
        throw err;
    }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    setupDatabase()
        .then(() => {
            console.log('Setup complete');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Setup failed:', err);
            process.exit(1);
        });
}