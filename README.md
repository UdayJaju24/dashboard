# About Developer Activity Dashboard
The Activity Dashboard provides a comprehensive view of developer activities, including commits, pull requests (both opened and merged), meetings, and documentation efforts. Users can select different metrics to view and analyze through a set of buttons, which dynamically update the data displayed in a 3D pie chart. This interactive chart visually represents the selected metric over time. The dashboard also features a developer selection dropdown, allowing users to filter the data by individual developers or view aggregated data for all developers. Below the chart, a detailed table lists the total counts for each activity metric per developer, offering a clear and concise overview of contributions. The user interface is designed for ease of use, with a sidebar for quick metric and developer selection and a main content area displaying the chart and data table.
### Steps involved in project
1. Create React App: Initialize a new React project with TypeScript.
```
npx create-react-app dev-activity-dashboard --template typescript
cd dev-activity-dashboard
```

2. Install Dependencies: Install the necessary libraries.
```
npm install axios recharts styled-components @types/styled-components
```

3. Mock API Endpoint:
   
- I have referred this [blog](https://medium.com/@peternjuguna76/hosting-a-json-file-on-github-pages-a-step-by-step-guide-52105a5a393a) to fetch the data on the dashboard of hosted website.

  - GitHub Repository Link
  ```
  https://github.com/UdayJaju24/API-JSON
  ```
  - Hosted Link for Data fetch on the dashboard
  ```
  https://udayjaju24.github.io/API-JSON/db.json
  ```
- Now, to fetch data on localhost following steps were followed by me. 

  - Install json-server
  ```
  npm install -g json-server
  ```
  - Create a db.json File
  ```
  {
    "activities": [
      {
        "id": 1,
        "date": "2023-06-01",
        "name": "Nilesh",
        "commits": 5,
        "pull_requests_opened": 2,
        "pull_requests_merged": 1,
        "meetings": 3,
        "documentation": 2
      },
      {
        "id": 2,
        "date": "2023-06-01",
        "name": "Chirag",
        "commits": 3,
        "pull_requests_opened": 1,
        "pull_requests_merged": 1,
        "meetings": 2,
        "documentation": 1
      }
      // Add more data for each developer and for the remaining days of the week
    ]
  }
  ```

  - Run the Mock API
  ```
  json-server --watch db.json --port 5000
  ```
### Getting to know more
4. Fetch Data:

- How Data is fetched from GitHub hosted link:-
  - Create src/ActivityChart.tsx
  
  We use Axios for data fetching (Already installed in Step 2). And below code is used to fetch data.
  ```
  const getActivities = async () => {
        try {
          const response = await axios.get('https://udayjaju24.github.io/API-JSON/db.json');
          const data = response.data.activities; // Access the activities array
          if (Array.isArray(data)) {
            setActivities(data); // Set activities data
            setFilteredActivities(aggregateData(data)); // Set aggregated data for the initial display
          } else {
            console.error('Data is not in the expected format:', data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      getActivities();
    }, []);
  ```
- How Data is fetched on localhost:-
  
    We use Axios for data fetching(ALready installed in Step 2). And below code is used to fetch data.
  - Create src/services/api.ts
  ```
  import axios from 'axios';
  
    const API_URL = 'http://localhost:5000';
  
   export const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}/activities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  };
  ```
  - Create src/ActivityChart.tsx
  ```
  const getActivities = async () => {
         const data = await fetchActivities();
         setActivities(data);
         setFilteredActivities(aggregateData(data));
       };
       getActivities();
    }, []);
  ```
**Note:** And I have commented the complete code in ActivityChart.jsx file below current code which fetches the data from json file on localhost and visulises the data.

5. Visualize Data:

- Install Highcharts and Highcharts React wrapper
```
npm install highcharts highcharts-react-official
```
- We have used Highcharts for visualization. Then Highcharts options are configured to display a 3D pie chart, including chart type, 3D settings, title, tooltip, plot options, and series data. A table displays the total counts for each activity metric per developer, providing a clear overview of contributions. 
```
// Configure Highcharts options
  const options = {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      style: {
        width: '100%',
        height: '100%',
      },
    },
    title: {
      text: `Developer Activities: ${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}`,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}',
        },
      },
    },
    series: [{
      type: 'pie',
      name: `${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}`,
      data: pieChartData,
    }],
  };
```

6. CSS Styling:

- The container is styled with a flexible layout, maximum width, and padding for a neat and centered appearance. 
- The sidebar is organized in a column layout with a margin for spacing. 
- Buttons are styled for interactivity, including padding, border, and hover effects, with additional styles for active state highlighting. 
- The select element and its container are styled for consistency and spacing. 
- The content area is divided into chart and table containers, both flexibly adjusted for alignment and display purposes. 
- The table is styled with full width, collapsed borders, and distinct header and data cell styles, including alternate background colors for better readability.
- Responsive design is achieved through media queries, adjusting layouts and styles for medium, small, and extra-small screens. 
  - For medium and small screens, the container layout switches to columnar, sidebar elements are wrapped, button styles are compacted, and table and chart container styles are tweaked for better fit and readability. 
  - For extra-small screens, the table layout is transformed into a block display to fit narrow screens, with headers hidden and data cells behaving like rows, ensuring accessibility and usability across different devices.

### Deployment of Project
7. Deploy the Project on GitHub:

I referred this [blog](https://medium.com/@swarajgosavi20/how-to-deploy-react-on-github-pages-33e427f0bd36) to host the project on GitHub.

- Install gh-pages:
  
  Install gh-pages using npm.
```
npm install --save gh-pages
```
- Add homepage:
  
Edit package.json and Add homepage to package.json and it will be like:
```
"homepage": "https://{myusername}.github.io/{repo-name}",
```
- Add deploy in scripts to package.json:
  
Now we will modify the scripts section inside the package.json by adding predeploy and deploy fields.
```
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  ...
}
```
- Git Commands:
   
Then we will run some git commands
```
git init
git add .
git status
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/<myusername>/<repo-name>.git
git push -u origin main
```

- Finally we will Deploy site:
  
Finally run the [npm run deploy] code in the terminal to deploy the react application.
```
npm run deploy
```


##### Final Folder Structure would be
```
dev-activity-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── ActivityChart.css
│   │   ├── ActivityChart.tsx
│   │   ├── StyledComponents.ts
│   ├── services/
│   │   ├── api.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── ...
├── db.json
├── package.json
├── ...
```

## Hosted Website Link
**To Preview the dashboard [click here](https://udayjaju24.github.io/dashboard/){:target="_blank" rel="noopener"}.** 
