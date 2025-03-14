# Stanford Course Planner

A super simple web application to help Stanford students plan their academic journey, track GPA, monitor workload, and ensure WAYS requirements are met. OnCourse and Carta are much better, but this planner also calculates gpa!

![Stanford Course Planner Screenshot](screenshot.png)

![Stanford Course Planner Screenshot](screenshot2.png)
## Features

- **Course Management**: Add, edit, and organize courses by year (Freshman, Sophomore, Junior, Senior) and quarter
- **Drag & Drop**: Easily move courses between quarters with intuitive drag and drop
- **GPA Calculation**: Automatically calculates GPA using Stanford's 4.2 scale
- **WAYS Requirements Tracking**: Visual progress bars for all eight WAYS categories
- **Workload Assessment**: Color-coded happiness ratings based on weekly hours
- **Graduation Progress**: Track progress toward 180 units required for graduation
- **Dark/Light Mode**: Toggle between light and dark themes
- **Data Persistence**: Automatic saving to browser's local storage
- **Import/Export**: Save and share your academic plan

## WAYS Requirements Tracked

- **AII**: Aesthetic and Interpretive Inquiry (2 courses)
- **SI**: Social Inquiry (2 courses)
- **SMA**: Scientific Method and Analysis (2 courses)
- **CE**: Creative Expression (2 units)
- **AQR**: Applied Quantitative Reasoning (1 course)
- **FR**: Formal Reasoning (1 course)
- **ER**: Ethical Reasoning (1 course)
- **EDP**: Exploring Difference and Power (1 course)

## Getting Started

### Quick Start

1. Clone this repository:
   ```
   git clone https://github.com/rivercraft911/stanfordcourseplanner.git
   ```
2. Open `index.html` in your web browser
3. Start planning your courses!

## Running the Application

### Option 1: Using a Local Server (Recommended)

For the best experience and to avoid browser security restrictions:

1. Navigate to the project directory in your terminal:
   ```bash
   cd stanford-course-planner
   ```

2. Start a simple HTTP server:
   ```bash
   # Using Python (already installed on most systems)
   python -m http.server    # Python 3
   # OR
   python -m SimpleHTTPServer   # Python 2
   
   # OR using Node.js
   npx http-server
   ```

3. Open your browser and visit:
   ```
   http://localhost:8000
   ```

### Option 2: Direct Browser Opening

For quick access (with some limitations):

1. Some modern browsers may restrict functionality when opening HTML files directly due to security policies
2. To use direct browser opening, you may need to adjust your browser security settings or use Firefox, which tends to be more permissive with local files
3. Simply double-click `index.html` or drag it into your browser window

### Data Storage

- Course data is automatically saved to your browser's local storage
- Use the Export/Import buttons to save your data as JSON files for backup or sharing
- Your data persists between browser sessions as long as you don't clear your browser cache

This application is designed to run entirely client-side with no backend dependencies, making it easy to deploy anywhere you can serve static files.



## How It Works

- **React**: The entire application is built using React via CDN, no build tools required
- **Tailwind CSS**: Styling is handled through Tailwind CSS via CDN
- **Lodash**: Used for data manipulation functions
- **Local Storage**: Your course data is automatically saved to your browser's local storage
  
## Development

To modify the application:

1. Edit `script.js` to change the application logic
2. Edit `index.html` to modify the HTML structure or add additional libraries
3. Refresh your browser to see changes

## License

MIT
