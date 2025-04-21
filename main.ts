import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const server = new McpServer({
    id: "jira_mcp",
    name: "Jira MCP",
    version: "1.0.0",
});


const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_API_KEY = process.env.JIRA_API_KEY;
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;

server.tool(
    'get_issue',
    'Get info about a Jira issue',
    { issue_key: z.string().describe('Jira issue key') },
    async ({ issue_key }) => {
        const response = await fetch(`${JIRA_BASE_URL}/rest/agile/1.0/issue/${issue_key}`, {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${Buffer.from(
                `${JIRA_USERNAME}:${JIRA_API_KEY}`
              ).toString('base64')}`,
              'Accept': 'application/json'
            }
          })
        const data = await response.json();
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
        };
    }
  );


const transport = new StdioServerTransport();
server.connect(transport);
