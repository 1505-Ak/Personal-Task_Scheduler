# ✨ Personal Task Scheduler

A beautiful, modern task scheduler built with Next.js, TypeScript, and Tailwind CSS. Perfect for managing your personal productivity with style!

## 🌟 Features

- **Beautiful UI**: Glassmorphism design with smooth animations
- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Priority Management**: Low, medium, and high priority levels with visual indicators
- **Due Date Tracking**: Set due dates and get overdue warnings
- **Category Organization**: Organize tasks by custom categories
- **Smart Filtering**: Filter by priority, status, and search terms
- **Real-time Stats**: Track total, completed, pending, and overdue tasks
- **Responsive Design**: Works perfectly on desktop and mobile
- **Task Completion**: Mark tasks as complete/incomplete with visual feedback
- **Data Persistence**: Simple JSON file storage (easily replaceable with database)

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Node.js, Express.js
- **Storage**: JSON file (can be easily upgraded to database)
- **Styling**: Custom glassmorphism design with gradient backgrounds

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Personal-Task_Scheduler
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

This will start both the frontend (Next.js) and backend (Express) servers concurrently:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🎯 Usage

### Adding Tasks
- Click the "Add Task" button
- Fill in the task details:
  - **Title**: Short description of the task
  - **Description**: Detailed description (optional)
  - **Priority**: Low, Medium, or High
  - **Due Date**: When the task should be completed
  - **Category**: Organize tasks by category

### Managing Tasks
- **Complete/Uncomplete**: Click the circle icon on the left
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the trash icon to remove the task

### Filtering & Search
- **Search**: Use the search bar to find tasks by title, description, or category
- **Priority Filter**: Filter tasks by priority level
- **Status Filter**: Show all, pending, or completed tasks only

### Statistics Dashboard
The top dashboard shows:
- **Total Tasks**: All tasks in your system
- **Completed**: Tasks marked as done
- **Pending**: Tasks still to be completed
- **Overdue**: Tasks past their due date

## 🗂️ Project Structure

```
Personal-Task_Scheduler/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── TaskCard.tsx       # Individual task card
│   └── TaskForm.tsx       # Task creation/editing form
├── lib/                   # Utility functions
│   └── api.ts            # API communication functions
├── server/               # Backend server
│   ├── index.js          # Express server
│   └── tasks.json        # Task data storage
├── types/                # TypeScript type definitions
│   └── task.ts           # Task interface definitions
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effect with backdrop blur
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Grid**: Adapts to different screen sizes
- **Visual Priority Indicators**: Color-coded priority levels
- **Interactive Hover Effects**: Enhanced user experience
- **Clean Typography**: Using Inter font for readability

## 🔧 Customization

### Adding New Categories
Edit the categories in `components/TaskForm.tsx`:
```tsx
<option value="work">Work</option>
<option value="personal">Personal</option>
<option value="health">Health</option>
// Add more categories here
```

### Changing Color Scheme
Modify colors in `tailwind.config.js`:
```js
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Database Integration
Replace the JSON file storage in `server/index.js` with your preferred database:
- MongoDB
- PostgreSQL
- MySQL
- SQLite

## 📱 Mobile Support

The application is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Production Deployment

### Frontend (Next.js)
```bash
npm run build
npm start
```

### Full Stack
Deploy to platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Heroku**
- **DigitalOcean**

## 🤝 Contributing

Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Enjoy!

Start organizing your tasks beautifully and boost your productivity! ✨

---

**Made with ❤️ for personal productivity** 