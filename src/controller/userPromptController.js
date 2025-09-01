import { getAllPrompt, createPrompt, updatePrompt, deletePrompt, createWebsite, updateWebsite, getWebsiteById, getAllWebsites, deleteWebsite } from "../models/userPromptModel.js";
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

// const OPENAI_API_KEY = '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'


// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

// IIS wwwroot path - adjust this to your IIS setup
const IIS_WWWROOT_PATH = process.env.IIS_WWWROOT_PATH || 'C:\\inetpub\\wwwroot';

// Existing prompt APIs
export async function listprompt(req, res) {
    try {
        const users = await getAllPrompt();
        res.json(users);
    } catch (err){
        res.status(500).json({error : err.message });
    }
}

export async function addprompt(req, res) {
     console.log("Incoming body:", req.body);
    const { name, UserPrompt, llmPrompt } = req.body;
    try {
        await createPrompt(name, UserPrompt, llmPrompt);
        res.json({message: "user created"})
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}

export async function editprompt(req, res) {
    const { id } = req.params;
    const { name, UserPrompt, llmPrompt} = req.body;
    try {
        await updatePrompt(id, name, UserPrompt, llmPrompt);
        res.json({ message: "user updated"})
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
}

export async function removeprompt(req, res) {
    const { id } = req.params;
    try {
        await deletePrompt(id);
        res.json({message: `${id} user deleted`});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

// Helper function to create directory structure

// Helper function to create directory structure
async function createDirectoryStructure(subdomain) {
    const sitePath = path.join(IIS_WWWROOT_PATH, subdomain);
    const cssPath = path.join(sitePath, 'css');
    const jsPath = path.join(sitePath, 'js');
    
    try {
        await fs.mkdir(sitePath, { recursive: true });
        await fs.mkdir(cssPath, { recursive: true });
        await fs.mkdir(jsPath, { recursive: true });
        return sitePath;
    } catch (err) {
        throw new Error(`Failed to create directory structure: ${err.message}`);
    }
}
// Helper function to extract CSS and JS from HTML
function extractCssJs(htmlContent) {
    const cssRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const jsRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    
    let css = '';
    let js = '';
    let cleanHtml = htmlContent;
    
    // Extract CSS
    let cssMatch;
    while ((cssMatch = cssRegex.exec(htmlContent)) !== null) {
        css += cssMatch[1] + '\n';
    }
    
    // Extract JS
    let jsMatch;
    while ((jsMatch = jsRegex.exec(htmlContent)) !== null) {
        if (!jsMatch[0].includes('src=')) {
            js += jsMatch[1] + '\n';
        }
    }

      
    // Remove inline styles and scripts from HTML, replace with external links
    cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    cleanHtml = cleanHtml.replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Add external CSS and JS links
    if (css.trim()) {
        cleanHtml = cleanHtml.replace('</head>', '  <link rel="stylesheet" href="css/style.css">\n</head>');
    }
    if (js.trim()) {
        cleanHtml = cleanHtml.replace('</body>', '  <script src="js/script.js"></script>\n</body>');
    }
    
    return { html: cleanHtml, css: css.trim(), js: js.trim() };
}

// Helper function to write files to IIS
async function writeFilesToIIS(sitePath, subdomain, html, css, js) {
    try {
        await fs.writeFile(path.join(sitePath, 'index.html'), html, 'utf8');
        
        if (css) {
            await fs.writeFile(path.join(sitePath, 'css', 'style.css'), css, 'utf8');
        }
        
        if (js) {
            await fs.writeFile(path.join(sitePath, 'js', 'script.js'), js, 'utf8');
        }
        
        console.log(`Website files created successfully at: ${sitePath}`);
        return true;
    } catch (err) {
        throw new Error(`Failed to write files: ${err.message}`);
    }
}
// New ChatGPT Website Generation APIs

export async function createweb(req, res) {
    const { prompt, websiteName, description, subdomain } = req.body;
    
    if (!subdomain) {
        return res.status(400).json({ error: "Subdomain is required" });
    }
    
    // Clean subdomain name (remove special characters, spaces)
    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    try {
        // Generate website code using ChatGPT
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a professional web developer. Create a complete, responsive website based on the user's requirements. 
                    
                    Requirements:
                    - Create a full HTML document with proper structure
                    - Include modern, responsive CSS styling within <style> tags in the head
                    - Add interactive JavaScript functionality within <script> tags before closing body tag
                    - Use modern design principles and best practices
                    - Make it mobile-friendly with responsive design
                    - Include proper meta tags and semantic HTML
                    - Use clean, professional styling with modern colors and typography
                    - Add hover effects, transitions, and interactive elements
                    - Ensure cross-browser compatibility
                    
                    Return ONLY the complete HTML code with embedded CSS and JavaScript, no explanations.`
                },
                {
                    role: "user",
                    content: `Create a website: ${prompt}`
                }
            ],
            max_tokens: 4000,
            temperature: 0.7
        });

        const generatedCode = completion.choices[0].message.content;
        
        // Extract CSS, JS, and clean HTML
        const { html, css, js } = extractCssJs(generatedCode);
        
        // Create directory structure in IIS wwwroot
        const sitePath = await createDirectoryStructure(cleanSubdomain);
        
        // Write files to IIS
        await writeFilesToIIS(sitePath, cleanSubdomain, html, css, js);
        
        // Save to database
        const websiteId = await createWebsite(websiteName, description, prompt, html, css, js, cleanSubdomain, sitePath);
        
        res.json({
            message: "Website created and deployed successfully",
            websiteId: websiteId,
            subdomain: cleanSubdomain,
            url: `http://localhost/${cleanSubdomain}`,
            deployPath: sitePath,
            files: {
                html: html,
                css: css,
                js: js
            }
        });

    } catch (err) {
        console.error("Error creating website:", err);
        res.status(500).json({ error: err.message });
    }
}

export async function updateweb(req, res) {
    const { id } = req.params;
    const { prompt, websiteName, description, modifications } = req.body;
    
    try {
        // Get existing website
        const existingWebsite = await getWebsiteById(id);
        
        if (!existingWebsite) {
            return res.status(404).json({ error: "Website not found" });
        }

        // Reconstruct full HTML for AI processing
        const fullHtml = `${existingWebsite.htmlCode}
        ${existingWebsite.cssCode ? `<style>${existingWebsite.cssCode}</style>` : ''}
        ${existingWebsite.jsCode ? `<script>${existingWebsite.jsCode}</script>` : ''}`;

        // Generate updated website code using ChatGPT
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a professional web developer. Update the existing website code based on the user's modification requests.
                    
                    Requirements:
                    - Maintain the existing structure where possible
                    - Apply the requested changes/improvements
                    - Keep the code clean and well-organized
                    - Ensure responsiveness and modern design
                    - Include CSS in <style> tags and JS in <script> tags
                    - Return ONLY the complete updated HTML code with embedded CSS and JavaScript.`
                },
                {
                    role: "user",
                    content: `Current website code:
                    ${fullHtml}
                    
                    Please make these modifications: ${modifications || prompt}`
                }
            ],
            max_tokens: 4000,
            temperature: 0.7
        });

        const updatedCode = completion.choices[0].message.content;
        
        // Extract CSS, JS, and clean HTML
        const { html, css, js } = extractCssJs(updatedCode);
        
        // Update files in IIS
        const sitePath = existingWebsite.deployPath || path.join(IIS_WWWROOT_PATH, existingWebsite.subdomain);
        await writeFilesToIIS(sitePath, existingWebsite.subdomain, html, css, js);
        
        // Update in database
        await updateWebsite(id, websiteName, description, prompt, html, css, js);
        
        res.json({
            message: "Website updated and redeployed successfully",
            websiteId: id,
            subdomain: existingWebsite.subdomain,
            url: `http://localhost/${existingWebsite.subdomain}`,
            files: {
                html: html,
                css: css,
                js: js
            }
        });

    } catch (err) {
        console.error("Error updating website:", err);
        res.status(500).json({ error: err.message });
    }
}

export async function listweb(req, res) {
    try {
        const websites = await getAllWebsites();
        res.json(websites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getweb(req, res) {
    const { id } = req.params;
    
    try {
        const website = await getWebsiteById(id);
        
        if (!website) {
            return res.status(404).json({ error: "Website not found" });
        }
        
        res.json(website);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function removeweb(req, res) {
    const { id } = req.params;
    
    try {
        const website = await getWebsiteById(id);
        
        if (!website) {
            return res.status(404).json({ error: "Website not found" });
        }
        
        // Remove files from IIS
        const sitePath = website.deployPath || path.join(IIS_WWWROOT_PATH, website.subdomain);
        try {
            await fs.rm(sitePath, { recursive: true, force: true });
            console.log(`Removed website files from: ${sitePath}`);
        } catch (fileErr) {
            console.warn(`Could not remove files: ${fileErr.message}`);
        }
        
        // Delete from database
        await deleteWebsite(id);
        res.json({ message: `Website ${id} deleted and undeployed successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function regenerateweb(req, res) {
    const { id } = req.params;
    const { style, approach } = req.body;
    
    try {
        const existingWebsite = await getWebsiteById(id);
        
        if (!existingWebsite) {
            return res.status(404).json({ error: "Website not found" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a professional web developer. Recreate the website with a different style/approach while keeping the same core content and purpose.
                    
                    Requirements:
                    - Maintain the same functionality and content
                    - Apply the new style/design approach requested
                    - Use modern web development best practices
                    - Ensure responsive design
                    - Include CSS in <style> tags and JS in <script> tags
                    - Return ONLY the complete HTML code with embedded CSS and JavaScript.`
                },
                {
                    role: "user",
                    content: `Original website prompt: ${existingWebsite.prompt}
                    
                    Please recreate this website with: ${style || approach || 'a fresh, modern design approach'}`
                }
            ],
            max_tokens: 4000,
            temperature: 0.8
        });

        const regeneratedCode = completion.choices[0].message.content;
        
        // Extract CSS, JS, and clean HTML
        const { html, css, js } = extractCssJs(regeneratedCode);
        
        // Update files in IIS
        const sitePath = existingWebsite.deployPath || path.join(IIS_WWWROOT_PATH, existingWebsite.subdomain);
        await writeFilesToIIS(sitePath, existingWebsite.subdomain, html, css, js);
        
        // Update in database
        await updateWebsite(id, existingWebsite.name, existingWebsite.description, existingWebsite.prompt, html, css, js);
        
        res.json({
            message: "Website regenerated and redeployed successfully",
            websiteId: id,
            subdomain: existingWebsite.subdomain,
            url: `http://localhost/${existingWebsite.subdomain}`,
            files: {
                html: html,
                css: css,
                js: js
            }
        });

    } catch (err) {
        console.error("Error regenerating website:", err);
        res.status(500).json({ error: err.message });
    }
}

// New API to preview website before deployment
export async function previewweb(req, res) {
    const { prompt } = req.body;
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `Create a complete, responsive website preview based on the user's requirements. Return ONLY HTML with embedded CSS and JavaScript.`
                },
                {
                    role: "user",
                    content: `Create a website: ${prompt}`
                }
            ],
            max_tokens: 4000,
            temperature: 0.7
        });

        const generatedCode = completion.choices[0].message.content;
        
        res.json({
            message: "Website preview generated",
            previewCode: generatedCode
        });

    } catch (err) {
        console.error("Error generating preview:", err);
        res.status(500).json({ error: err.message });
    }
}

// API to deploy existing website to new subdomain
export async function deployweb(req, res) {
    const { id } = req.params;
    const { newSubdomain } = req.body;
    
    try {
        const website = await getWebsiteById(id);
        
        if (!website) {
            return res.status(404).json({ error: "Website not found" });
        }
        
        const cleanSubdomain = newSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
        
        // Create new directory structure
        const sitePath = await createDirectoryStructure(cleanSubdomain);
        
        // Write files to new location
        await writeFilesToIIS(sitePath, cleanSubdomain, website.htmlCode, website.cssCode, website.jsCode);
        
        // Update database with new subdomain info
        await updateWebsiteDeployment(id, cleanSubdomain, sitePath);
        
        res.json({
            message: "Website deployed to new subdomain successfully",
            websiteId: id,
            subdomain: cleanSubdomain,
            url: `http://localhost/${cleanSubdomain}`,
            deployPath: sitePath
        });

    } catch (err) {
        console.error("Error deploying website:", err);
        res.status(500).json({ error: err.message });
    }
}