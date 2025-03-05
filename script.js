// Simplified component definitions for UI
const Card = ({ className, children }) => (
    <div className={`rounded-lg overflow-hidden ${className}`}>{children}</div>
  );
  
  const CardHeader = ({ className, children }) => (
    <div className={`p-4 ${className}`}>{children}</div>
  );
  
  const CardTitle = ({ className, children }) => (
    <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
  );
  
  const CardContent = ({ className = '', children }) => (
    <div className={`p-4 ${className}`}>{children}</div>
  );
  
  const StanfordCoursePlanner = () => {
    // Theme state
    const [darkMode, setDarkMode] = React.useState(false);
    
    // Stanford GPA mapping
    const gpaMapping = {
      'A+': 4.2,
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D+': 1.3,
      'D': 1.0,
      'D-': 0.7,
      'F': 0.0,
      'N/A': null
    };
  
    // WAYS requirements
    const waysRequirements = {
      'AII': { name: 'Aesthetic and Interpretive Inquiry', required: 2 },
      'SI': { name: 'Social Inquiry', required: 2 },
      'SMA': { name: 'Scientific Method and Analysis', required: 2 },
      'CE': { name: 'Creative Expression', required: 2 },
      'AQR': { name: 'Applied Quantitative Reasoning', required: 1 },
      'FR': { name: 'Formal Reasoning', required: 1 },
      'ER': { name: 'Ethical Reasoning', required: 1 },
      'EDP': { name: 'Exploring Difference and Power', required: 1 }
    };
  
    // Happiness ratings
    const happinessRatings = [
      { maxHours: 40, label: 'Happy 😃', color: darkMode ? 'text-green-400' : 'text-emerald-600' },
      { maxHours: 50, label: 'Medium 😐', color: darkMode ? 'text-yellow-400' : 'text-amber-600' },
      { maxHours: Infinity, label: 'Sad 😞', color: darkMode ? 'text-red-400' : 'text-rose-600' }
    ];
  
    // Academic years mapping
    const yearMapping = {
      '1': 'Freshman',
      '2': 'Sophomore',
      '3': 'Junior',
      '4': 'Senior'
    };
  
    // State for courses
    const [courses, setCourses] = React.useState([]);
    const [unadded, setUnadded] = React.useState([]);
    const [newCourse, setNewCourse] = React.useState({
      id: '',
      code: '',
      units: 3,
      hours: 9,
      quarter: 'Autumn',
      year: '1',
      grade: 'N/A',
      ways: []
    });
    const [draggedCourse, setDraggedCourse] = React.useState(null);
    const [dropTarget, setDropTarget] = React.useState(null);
  
    // Years and quarters
    const years = ['1', '2', '3', '4'];
    const quarters = ['Autumn', 'Winter', 'Spring', 'Summer'];
  
    // Check for dark mode preference
    React.useEffect(() => {
      const storedDarkMode = localStorage.getItem('stanfordPlannerDarkMode');
      if (storedDarkMode) {
        setDarkMode(storedDarkMode === 'true');
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
      }
      
      // Apply dark mode to body
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);
  
    // Load saved data on initial render
    React.useEffect(() => {
      try {
        const savedCourses = localStorage.getItem('stanfordCourses');
        const savedUnadded = localStorage.getItem('stanfordUnadded');
        
        if (savedCourses) {
          setCourses(JSON.parse(savedCourses));
        }
        
        if (savedUnadded) {
          setUnadded(JSON.parse(savedUnadded));
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }, []);
  
    // Save data whenever courses or unadded changes
    React.useEffect(() => {
      try {
        localStorage.setItem('stanfordCourses', JSON.stringify(courses));
        localStorage.setItem('stanfordUnadded', JSON.stringify(unadded));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }, [courses, unadded]);
  
    // Toggle dark mode
    const toggleDarkMode = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      localStorage.setItem('stanfordPlannerDarkMode', newMode.toString());
    };
  
    // Add a new course to either enrolled or unadded
    const addCourse = (isEnrolled) => {
      if (!newCourse.code.trim()) return;
      
      const courseToAdd = {
        ...newCourse,
        id: Date.now().toString()
      };
      
      if (isEnrolled) {
        setCourses(prev => [...prev, courseToAdd]);
      } else {
        setUnadded(prev => [...prev, courseToAdd]);
      }
      
      setNewCourse({
        id: '',
        code: '',
        units: 3,
        hours: 9,
        quarter: 'Autumn',
        year: '1',
        grade: 'N/A',
        ways: []
      });
    };
  
    // Move course between enrolled and unadded
    const moveCourse = (id, fromEnrolled, targetQuarter = null, targetYear = null) => {
      const sourceCourses = fromEnrolled ? courses : unadded;
      const targetSetter = fromEnrolled ? setUnadded : setCourses;
      const sourceSetter = fromEnrolled ? setCourses : setUnadded;
      
      const courseToMove = sourceCourses.find(course => course.id === id);
      
      // Update quarter and year if provided
      const updatedCourse = {
        ...courseToMove,
        quarter: targetQuarter || courseToMove.quarter,
        year: targetYear || courseToMove.year
      };
      
      targetSetter(prev => [...prev, updatedCourse]);
      sourceSetter(prev => prev.filter(course => course.id !== id));
    };
  
    // Update course grade
    const updateGrade = (id, grade) => {
      setCourses(prev => 
        prev.map(course => 
          course.id === id ? { ...course, grade } : course
        )
      );
    };
  
    // Update course hours
    const updateHours = (id, hours) => {
      setCourses(prev => 
        prev.map(course => 
          course.id === id ? { ...course, hours: parseInt(hours) } : course
        )
      );
    };
  
    // Update course units
    const updateUnits = (id, units) => {
      setCourses(prev => 
        prev.map(course => 
          course.id === id ? { ...course, units: parseInt(units) } : course
        )
      );
    };
  
    // Toggle WAYS requirement for a course
    const toggleWay = (id, way) => {
      setCourses(prev => 
        prev.map(course => {
          if (course.id === id) {
            const ways = course.ways.includes(way)
              ? course.ways.filter(w => w !== way)
              : [...course.ways, way];
            return { ...course, ways };
          }
          return course;
        })
      );
    };
  
    // Delete course
    const deleteCourse = (id, fromEnrolled) => {
      const setter = fromEnrolled ? setCourses : setUnadded;
      setter(prev => prev.filter(course => course.id !== id));
    };
  
    // Calculate cumulative GPA
    const calculateGPA = () => {
      const gradedCourses = courses.filter(course => gpaMapping[course.grade] !== null);
      
      if (gradedCourses.length === 0) return 0;
      
      const totalPoints = gradedCourses.reduce((sum, course) => 
        sum + gpaMapping[course.grade] * course.units, 0);
      const totalUnits = gradedCourses.reduce((sum, course) => sum + course.units, 0);
      
      return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : 0;
    };
  
    // Calculate total units completed
    const calculateTotalUnits = () => {
      return courses.reduce((sum, course) => {
        // Only count courses with a grade other than N/A
        return course.grade !== 'N/A' ? sum + course.units : sum;
      }, 0);
    };
  
    // Calculate WAYS progress
    const calculateWaysProgress = () => {
      const waysCounter = { ...Object.fromEntries(Object.keys(waysRequirements).map(key => [key, 0])) };
      
      courses.forEach(course => {
        course.ways.forEach(way => {
          // For CE, we count units
          if (way === 'CE') {
            waysCounter[way] += course.units;
          } else {
            waysCounter[way] += 1;
          }
        });
      });
      
      return waysCounter;
    };
  
    // Calculate quarter statistics
    const calculateQuarterStats = () => {
      const quarterGroups = _.groupBy(courses, course => `${course.quarter} (${yearMapping[course.year]})`);
      
      return Object.entries(quarterGroups).map(([key, coursesInQuarter]) => {
        const totalHours = coursesInQuarter.reduce((sum, course) => sum + course.hours, 0);
        const totalUnits = coursesInQuarter.reduce((sum, course) => sum + course.units, 0);
        
        // Find happiness rating
        const happiness = happinessRatings.find(rating => totalHours <= rating.maxHours);
        
        // Calculate GPA for quarter
        const gradedCourses = coursesInQuarter.filter(course => gpaMapping[course.grade] !== null);
        let quarterGPA = 0;
        
        if (gradedCourses.length > 0) {
          const totalPoints = gradedCourses.reduce((sum, course) => 
            sum + gpaMapping[course.grade] * course.units, 0);
          const totalGradedUnits = gradedCourses.reduce((sum, course) => sum + course.units, 0);
          quarterGPA = totalGradedUnits > 0 ? (totalPoints / totalGradedUnits).toFixed(2) : 0;
        }
        
        return {
          quarter: key,
          totalHours,
          totalUnits,
          happiness,
          quarterGPA
        };
      });
    };
  
    // Group courses by year and quarter for display
    const getGroupedCourses = () => {
      const byYear = _.groupBy(courses, 'year');
      
      return years.map(year => {
        const coursesInYear = byYear[year] || [];
        const byQuarter = {};
        
        // Initialize all quarters
        quarters.forEach(q => {
          byQuarter[q] = coursesInYear.filter(course => course.quarter === q);
        });
        
        return {
          year,
          yearName: yearMapping[year],
          quarters: byQuarter
        };
      });
    };
  
    // Handle WAYS checkbox change
    const handleWaysChange = (way) => {
      setNewCourse(prev => {
        const ways = prev.ways.includes(way)
          ? prev.ways.filter(w => w !== way)
          : [...prev.ways, way];
        return { ...prev, ways };
      });
    };
  
    // Handle drag start
    const handleDragStart = (e, course, isEnrolled) => {
      setDraggedCourse({ course, isEnrolled });
      e.dataTransfer.setData('text/plain', course.id);
    };
  
    // Handle drag over
    const handleDragOver = (e, quarter, year) => {
      e.preventDefault();
      setDropTarget({ quarter, year });
    };
  
    // Handle drop
    const handleDrop = (e, quarter, year) => {
      e.preventDefault();
      if (!draggedCourse) return;
      
      const { course, isEnrolled } = draggedCourse;
      moveCourse(course.id, isEnrolled, quarter, year);
      
      setDraggedCourse(null);
      setDropTarget(null);
    };
  
    // Handle drag end
    const handleDragEnd = () => {
      setDraggedCourse(null);
      setDropTarget(null);
    };
  
    // Export data as JSON
    const exportData = () => {
      const data = {
        courses,
        unadded
      };
      
      const dataStr = JSON.stringify(data);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'stanford-course-planner.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    };
  
    // Import data from JSON
    const importData = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.courses) setCourses(data.courses);
          if (data.unadded) setUnadded(data.unadded);
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    };
  
    // Theme-dependent style classes
    const themeClasses = {
        mainBg: darkMode ? 'bg-[#1a1b26]' : 'bg-gray-50',
        cardBg: darkMode ? 'bg-[#24273a]' : 'bg-white',
        headerBg: darkMode ? 'bg-[#6d128d]' : 'bg-cardinal-light',  // Changed to your specified purple
        text: darkMode ? 'text-[#c0caf5]' : 'text-gray-800',
        textSecondary: darkMode ? 'text-[#a9b1d6]' : 'text-gray-600',
        inputBg: darkMode ? 'bg-[#1a1b26]' : 'bg-white',
        inputBorder: darkMode ? 'border-[#414868]' : 'border-gray-300',
        buttonPrimary: darkMode ? 'bg-[#6c1cff] hover:bg-[#9d7cd8]' : 'bg-cardinal-light hover:bg-red-700',
        yearHeaderBg: darkMode ? 'bg-[#1a1b26]' : 'bg-gray-50',
        dropTargetBg: darkMode ? 'bg-[#3b4261]' : 'bg-blue-50',
        tableBg: darkMode ? 'bg-[#24273a]' : 'bg-white',
        tableHeaderBg: darkMode ? 'bg-[#1a1b26]' : 'bg-gray-50',
        tableRowHover: darkMode ? 'hover:bg-[#292e42]' : 'hover:bg-gray-50',
        tableRowBorder: darkMode ? 'border-[#414868]' : 'border-gray-200',
        formBg: darkMode ? 'bg-[#1f2335]' : 'bg-gray-50',
        cardShadow: darkMode ? 'shadow-lg shadow-black/50' : 'shadow-lg',
        progressBg: darkMode ? 'bg-[#414868]' : 'bg-gray-200',
        progressComplete: darkMode ? 'bg-[#9ece6a]' : 'bg-emerald-600',
        progressIncomplete: darkMode ? 'bg-[#7aa2f7]' : 'bg-blue-600',
        waysBadgeBg: darkMode ? 'bg-[#7dcfff]' : 'bg-blue-600',
        waysBadgeInactive: darkMode ? 'bg-[#414868]' : 'bg-gray-200',
      };
    
  
    return (
      <div className={`flex flex-col gap-6 p-4 ${themeClasses.mainBg} ${themeClasses.text} min-h-screen transition-colors duration-200`}>
        <div className={`flex justify-between items-center sticky top-0 z-10 p-4 bg-opacity-90 backdrop-blur-sm mb-2 rounded-lg shadow-md ${themeClasses.headerBg}`}>
        <h1 className="text-2xl font-bold text-white">Stanford Course Planner</h1>
        <button 
            onClick={toggleDarkMode} 
            className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
        >
            {darkMode ? '☀️' : '🌙'}
        </button>
        </div>
        
        <Card className={`${themeClasses.cardBg} ${themeClasses.cardShadow} border-0`}>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <div className={`${themeClasses.formBg} p-4 rounded-lg shadow-inner`}>
                  <h3 className="text-xl font-bold mb-4 text-cardinal-light dark:text-red-400">Add New Course</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${themeClasses.textSecondary}`}>Course Code</label>
                      <input
                        type="text"
                        className={`w-full p-2 border ${themeClasses.inputBorder} rounded-md shadow-sm ${themeClasses.inputBg} focus:ring-cardinal-light focus:border-cardinal-light`}
                        value={newCourse.code}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="CS106A"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${themeClasses.textSecondary}`}>Term</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          className={`p-2 border ${themeClasses.inputBorder} rounded-md shadow-sm ${themeClasses.inputBg}`}
                          value={newCourse.quarter}
                          onChange={(e) => setNewCourse(prev => ({ ...prev, quarter: e.target.value }))}
                        >
                          {quarters.map(quarter => (
                            <option key={quarter} value={quarter}>{quarter}</option>
                          ))}
                        </select>
                        <select
                          className={`p-2 border ${themeClasses.inputBorder} rounded-md shadow-sm ${themeClasses.inputBg}`}
                          value={newCourse.year}
                          onChange={(e) => setNewCourse(prev => ({ ...prev, year: e.target.value }))}
                        >
                          {years.map(year => (
                            <option key={year} value={year}>{yearMapping[year]}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${themeClasses.textSecondary}`}>Units</label>
                      <div className="flex items-center">
                        <button 
                          className={`px-3 py-1 ${themeClasses.waysBadgeInactive} rounded-l-md border ${themeClasses.inputBorder}`}
                          onClick={() => setNewCourse(prev => ({ ...prev, units: Math.max(1, prev.units - 1) }))}
                        >-</button>
                        <input
                          type="number"
                          className={`w-full p-2 text-center border-y ${themeClasses.inputBorder} ${themeClasses.inputBg}`}
                          value={newCourse.units}
                          onChange={(e) => setNewCourse(prev => ({ ...prev, units: parseInt(e.target.value) || 0 }))}
                          min="1"
                          max="20"
                        />
                        <button 
                          className={`px-3 py-1 ${themeClasses.waysBadgeInactive} rounded-r-md border ${themeClasses.inputBorder}`}
                          onClick={() => setNewCourse(prev => ({ ...prev, units: Math.min(20, prev.units + 1) }))}
                        >+</button>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${themeClasses.textSecondary}`}>Hours/Week</label>
                      <div className="flex items-center">
                        <button 
                          className={`px-3 py-1 ${themeClasses.waysBadgeInactive} rounded-l-md border ${themeClasses.inputBorder}`}
                          onClick={() => setNewCourse(prev => ({ ...prev, hours: Math.max(1, prev.hours - 1) }))}
                        >-</button>
                        <input
                          type="number"
                          className={`w-full p-2 text-center border-y ${themeClasses.inputBorder} ${themeClasses.inputBg}`}
                          value={newCourse.hours}
                          onChange={(e) => setNewCourse(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                          min="1"
                          max="100"
                        />
                        <button 
                          className={`px-3 py-1 ${themeClasses.waysBadgeInactive} rounded-r-md border ${themeClasses.inputBorder}`}
                          onClick={() => setNewCourse(prev => ({ ...prev, hours: Math.min(100, prev.hours + 1) }))}
                        >+</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {Object.entries(waysRequirements).map(([key, { name }]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`way-${key}`}
                          checked={newCourse.ways.includes(key)}
                          onChange={() => handleWaysChange(key)}
                          className="h-4 w-4 text-cardinal-light dark:text-red-500 focus:ring-cardinal-light rounded mr-2"
                        />
                        <label htmlFor={`way-${key}`} className="text-sm">{key}</label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => addCourse(true)}
                      className={`px-4 py-2 ${themeClasses.buttonPrimary} text-white rounded-md shadow transition-colors`}
                    >
                      Add to Enrolled
                    </button>
                    <button
                      onClick={() => addCourse(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 transition-colors"
                    >
                      Add to Unadded
                    </button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-cardinal-light dark:text-red-400">Quarters Overview</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={exportData}
                        className="px-3 py-1 bg-blue-600 dark:bg-blue-800 text-white text-sm rounded-md shadow hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                      >
                        Export Data
                      </button>
                      <label className="px-3 py-1 bg-green-600 dark:bg-green-800 text-white text-sm rounded-md shadow hover:bg-green-700 dark:hover:bg-green-700 transition-colors cursor-pointer">
                        Import Data
                        <input 
                          type="file" 
                          accept=".json" 
                          onChange={importData} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                  <div className={`${themeClasses.tableBg} rounded-lg shadow overflow-hidden`}>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className={themeClasses.tableHeaderBg}>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quarter</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Units</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hours/Week</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Happiness</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">GPA</th>
                        </tr>
                      </thead>
                      <tbody className={`${themeClasses.tableBg} divide-y ${themeClasses.tableRowBorder}`}>
                        {calculateQuarterStats().map(({ quarter, totalHours, totalUnits, happiness, quarterGPA }) => (
                          <tr key={quarter} className={themeClasses.tableRowHover}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{quarter}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">{totalUnits}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">{totalHours}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${happiness.color}`}>{happiness.label}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">{quarterGPA}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className={`${themeClasses.formBg} p-4 rounded-lg shadow-inner`}>
                <h3 className="text-xl font-bold mb-4 text-cardinal-light dark:text-red-400">Summary</h3>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium">Cumulative GPA:</span>
                    <span className="text-xl font-bold text-cardinal-light dark:text-red-400">{calculateGPA()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Units Progress:</span>
                    <span className="text-xl font-bold text-cardinal-light dark:text-red-400">{calculateTotalUnits()}/180</span>
                  </div>
                  <div className={`w-full ${themeClasses.progressBg} rounded-full h-2.5`}>
                    <div 
                      className="bg-cardinal-light dark:bg-red-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (calculateTotalUnits() / 180) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <h4 className="font-bold mb-2 text-lg text-cardinal-light dark:text-red-400">WAYS Progress</h4>
                <div className="space-y-2">
                  {Object.entries(waysRequirements).map(([key, { name, required }]) => {
                    const progress = calculateWaysProgress()[key];
                    const isComplete = key === 'CE' ? progress >= required : progress >= required;
                    
                    return (
                      <div key={key} className={`${themeClasses.cardBg} p-2 rounded-md shadow-sm`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{key}:</span>
                          <span className={isComplete ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
                            {progress}/{required}
                          </span>
                        </div>
                        <div className={`text-sm ${themeClasses.textSecondary}`}>{name}</div>
                        <div className={`w-full ${themeClasses.progressBg} rounded-full h-1.5 mt-1`}>
                          <div 
                            className={`${isComplete ? themeClasses.progressComplete : themeClasses.progressIncomplete} h-1.5 rounded-full`} 
                            style={{ width: `${Math.min(100, (progress / required) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${themeClasses.cardBg} ${themeClasses.cardShadow} border-0`}>
          <CardHeader className={themeClasses.headerBg}>
            <CardTitle className="text-white">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {getGroupedCourses().map(({ year, yearName, quarters: quarterCourses }) => (
              <div key={year} className={`border-b ${themeClasses.tableRowBorder} last:border-0`}>
                <h3 className={`text-lg font-bold p-4 ${themeClasses.yearHeaderBg} text-cardinal-light dark:text-red-400`}>{yearName} Year</h3>
                
                <div className={`grid md:grid-cols-4 border-t ${themeClasses.tableRowBorder}`}>
                  {quarters.map((quarter) => (
                    <div 
                      key={quarter} 
                      className={`p-4 border-r ${themeClasses.tableRowBorder} last:border-r-0 ${
                        dropTarget && dropTarget.quarter === quarter && dropTarget.year === year
                          ? themeClasses.dropTargetBg
                          : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, quarter, year)}
                      onDrop={(e) => handleDrop(e, quarter, year)}
                    >
                      <h4 className="font-bold mb-2">{quarter}</h4>
                      {quarterCourses[quarter].length === 0 ? (
                        <div className={`text-center py-4 text-gray-500 dark:text-gray-400 text-sm italic`}>Drop courses here</div>
                      ) : (
                        <div className="space-y-2">
                          {quarterCourses[quarter].map(course => (
                            <div 
                              key={course.id} 
                              className={`${themeClasses.cardBg} p-2 rounded-md shadow-sm`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, course, true)}
                              onDragEnd={handleDragEnd}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{course.code}</span>
                                <select
                                  className={`text-xs p-1 border rounded-md ${themeClasses.inputBg} ${themeClasses.inputBorder}`}
                                  value={course.grade}
                                  onChange={(e) => updateGrade(course.id, e.target.value)}
                                >
                                  {Object.keys(gpaMapping).map(grade => (
                                    <option key={grade} value={grade}>{grade}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex justify-between text-sm mt-1">
                                <div className="flex items-center">
                                  <span className="mr-2">Units:</span>
                                  <div className="flex border rounded-md">
                                    <button 
                                      className={`px-1 ${themeClasses.waysBadgeInactive}`}
                                      onClick={() => updateUnits(course.id, Math.max(1, course.units - 1))}
                                    >-</button>
                                    <span className="px-2">{course.units}</span>
                                    <button 
                                      className={`px-1 ${themeClasses.waysBadgeInactive}`}
                                      onClick={() => updateUnits(course.id, Math.min(20, course.units + 1))}
                                    >+</button>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span className="mr-2">Hours:</span>
                                  <div className="flex border rounded-md">
                                    <button 
                                      className={`px-1 ${themeClasses.waysBadgeInactive}`}
                                      onClick={() => updateHours(course.id, Math.max(1, course.hours - 1))}
                                    >-</button>
                                    <span className="px-2">{course.hours}</span>
                                    <button 
                                      className={`px-1 ${themeClasses.waysBadgeInactive}`}
                                      onClick={() => updateHours(course.id, Math.min(100, course.hours + 1))}
                                    >+</button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {Object.keys(waysRequirements).map(way => (
                                  <button
                                    key={way}
                                    onClick={() => toggleWay(course.id, way)}
                                    className={`px-1 text-xs rounded ${
                                      course.ways.includes(way) 
                                        ? themeClasses.waysBadgeBg + ' text-white' 
                                        : themeClasses.waysBadgeInactive
                                    }`}
                                  >
                                    {way}
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-end gap-1 mt-2">
                                <button
                                  onClick={() => moveCourse(course.id, true)}
                                  className="px-2 py-0.5 text-xs bg-amber-600 dark:bg-amber-700 text-white rounded"
                                >
                                  Unadd
                                </button>
                                <button
                                  onClick={() => deleteCourse(course.id, true)}
                                  className="px-2 py-0.5 text-xs bg-red-600 dark:bg-red-700 text-white rounded"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className={`${themeClasses.cardBg} ${themeClasses.cardShadow} border-0`}>
            <CardHeader className={`${themeClasses.headerBg} text-white`}>
            <CardTitle>Unadded Courses</CardTitle>
        </CardHeader>
          <CardContent>
            {unadded.length === 0 ? (
              <p className={`p-4 text-gray-500 dark:text-gray-400 italic`}>No unadded courses</p>
            ) : (
              <div className="p-4 grid gap-2">
                {unadded.map(course => (
                  <div 
                    key={course.id} 
                    className={`${themeClasses.cardBg} p-3 rounded-md shadow-sm border ${themeClasses.inputBorder} flex justify-between items-center`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, course, false)}
                    onDragEnd={handleDragEnd}
                  >
                    <div>
                      <div className="font-medium">{course.code}</div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>
                        {course.units} units | {course.hours} hours/week
                      </div>
                      {course.ways.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {course.ways.map(way => (
                            <span key={way} className={`px-1 text-xs ${themeClasses.waysBadgeBg} text-white rounded`}>
                              {way}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${themeClasses.textSecondary}`}>Term</label>
                        <select
                          className={`p-1 text-sm border rounded-md ${themeClasses.inputBg} ${themeClasses.inputBorder}`}
                          value={`${course.quarter}-${course.year}`}
                          onChange={(e) => {
                            const [quarter, year] = e.target.value.split('-');
                            moveCourse(course.id, false, quarter, year);
                          }}
                        >
                          {years.map(year => 
                            quarters.map(quarter => (
                              <option key={`${quarter}-${year}`} value={`${quarter}-${year}`}>
                                {quarter} ({yearMapping[year]})
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveCourse(course.id, false)}
                          className="px-3 py-1 bg-green-600 dark:bg-green-700 text-white text-sm rounded"
                        >
                          Enroll
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id, false)}
                          className="px-3 py-1 bg-red-600 dark:bg-red-700 text-white text-sm rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className={`p-4 ${themeClasses.cardBg} rounded-lg shadow-sm mb-4`}>
          <h3 className="text-lg font-bold mb-4 text-cardinal-light dark:text-red-400">How to use this planner</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Add courses using the form at the top</li>
            <li>Drag and drop courses between quarters</li>
            <li>Track your progress toward graduation (180 units)</li>
            <li>Monitor WAYS requirements completion</li>
            <li>See happiness ratings based on weekly workload</li>
            <li>Export your data to save or share your academic plan</li>
            <li>Toggle dark mode with the sun/moon button at the top</li>
          </ol>
          
          <h4 className="font-bold mt-4 mb-2 text-cardinal-light dark:text-red-400">Installing on your computer</h4>
          <p>
            This application saves your data to your browser's local storage automatically. 
            To run this on your computer:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>Export your data using the "Export Data" button</li>
            <li>Save the code to an HTML file</li>
            <li>Open the HTML file in your browser</li>
            <li>Import your data using the "Import Data" button</li>
          </ol>
          <p className="mt-2">
            For a more advanced setup, you could host this as a React application using tools like
            Create React App, Next.js, or deploy it to a hosting service like Vercel or Netlify.
          </p>
        </div>
      </div>
    );
  };
  
  // Render the app
  ReactDOM.render(<StanfordCoursePlanner />, document.getElementById('root'));