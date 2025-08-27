# Medical Template Builder

A web application for creating and managing medical document templates with support for variables and dropdown selections.

## Features

- 🔐 Simple password authentication
- 📝 Create and edit templates
- 🔄 Template variable support
- 📋 Dropdown lists for quick selection
- 📋 One-click text copying to clipboard
- 💾 Auto-save to MongoDB
- 🔍 Search templates by name
- 📱 Responsive design

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens in cookies

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   Create `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medical-templates
   JWT_SECRET=your-super-secret-jwt-key
   ADMIN_PASSWORD=your-admin-password
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## MongoDB Setup

1. Create an account at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a new cluster (free tier 512MB available)
3. Get connection string and add it to `.env.local`

## Deploy on Vercel

1. Push project to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel settings
4. Deploy the project

## Usage

1. Open application in browser
2. Enter password (default: `admin123` or use `ADMIN_PASSWORD` from .env)
3. Create new templates or use existing ones
4. Use variables in curly braces: `{patient_name}`
5. Set up dropdown lists for quick selection
6. Copy ready text with one click

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── dashboard/    # Main application page
│   ├── login/        # Authentication page
│   └── page.tsx      # Home page (redirect)
├── components/       # React components
├── lib/             # Utilities (auth, mongodb)
└── models/          # Mongoose models
```

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create new template
- `PUT /api/templates/[id]` - Update template
- `DELETE /api/templates/[id]` - Delete template

## Password Configuration

The application supports both plain text and bcrypt hashed passwords in the `ADMIN_PASSWORD` environment variable:

- **Plain text**: `ADMIN_PASSWORD=mypassword`
- **Bcrypt hash**: `ADMIN_PASSWORD=$2b$12$hashedpassword...`

The system automatically detects the format and uses appropriate verification.

## License

MIT License
