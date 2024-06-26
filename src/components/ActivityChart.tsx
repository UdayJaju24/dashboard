import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './ActivityChart.css';

// Initialize Highcharts 3D module
Highcharts3D(Highcharts);

// Define the structure of an Activity object
interface Activity {
  id: number;
  date: string;
  name: string;
  commits: number;
  pull_requests_opened: number;
  pull_requests_merged: number;
  meetings: number;
  documentation: number;
}

// Define the possible activity metrics
type ActivityMetric = 'commits' | 'pull_requests_opened' | 'pull_requests_merged' | 'meetings' | 'documentation';

const ActivityChart: React.FC = () => {
  // State variables to manage activities data and selected filters
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<ActivityMetric>('commits');
  const [selectedDeveloper, setSelectedDeveloper] = useState<string | null>(null);

  // Fetch activities data when the component mounts
  useEffect(() => {
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

  // Handle metric selection change
  const handleMetricChange = (metric: ActivityMetric) => {
    setSelectedMetric(metric);
    filterActivities(metric, selectedDeveloper); // Filter activities based on selected metric
  };

  // Handle developer selection change
  const handleDeveloperChange = (developer: string) => {
    setSelectedDeveloper(developer);
    filterActivities(selectedMetric, developer); // Filter activities based on selected developer
  };

  // Aggregate data by date
  const aggregateData = (activities: Activity[]): Activity[] => {
    const aggregated: { [key: string]: Activity } = {};

    activities.forEach(activity => {
      if (!aggregated[activity.date]) {
        // Initialize aggregate entry for the date
        aggregated[activity.date] = {
          id: activity.id,
          date: activity.date,
          name: 'All',
          commits: 0,
          pull_requests_opened: 0,
          pull_requests_merged: 0,
          meetings: 0,
          documentation: 0,
        };
      }

      // Aggregate values for each metric
      aggregated[activity.date].commits += activity.commits;
      aggregated[activity.date].pull_requests_opened += activity.pull_requests_opened;
      aggregated[activity.date].pull_requests_merged += activity.pull_requests_merged;
      aggregated[activity.date].meetings += activity.meetings;
      aggregated[activity.date].documentation += activity.documentation;
    });

    return Object.values(aggregated); // Return aggregated values as an array
  };

  // Filter activities based on selected metric and developer
  const filterActivities = (metric: ActivityMetric, developer: string | null) => {
    let filtered = activities.filter(activity =>
      activity[metric] !== undefined && (developer ? activity.name === developer : true)
    );

    // Aggregate data if no specific developer is selected
    if (developer === null || developer === '') {
      filtered = aggregateData(filtered);
    }

    setFilteredActivities(filtered); // Set filtered activities
  };

  // Get unique developers from the activities
  const uniqueDevelopers = Array.from(new Set(activities.map(activity => activity.name)));

  // Prepare data for the pie chart
  const pieChartData = filteredActivities.map(activity => ({
    name: activity.date,
    y: activity[selectedMetric],
  }));

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

  // Calculate total counts for each developer
  const getTotalCounts = () => {
    const totals: { [key: string]: { [key in ActivityMetric]: number } } = {};

    activities.forEach(activity => {
      if (!totals[activity.name]) {
        // Initialize total entry for the developer
        totals[activity.name] = {
          commits: 0,
          pull_requests_opened: 0,
          pull_requests_merged: 0,
          meetings: 0,
          documentation: 0,
        };
      }

      // Aggregate values for each metric
      totals[activity.name].commits += activity.commits;
      totals[activity.name].pull_requests_opened += activity.pull_requests_opened;
      totals[activity.name].pull_requests_merged += activity.pull_requests_merged;
      totals[activity.name].meetings += activity.meetings;
      totals[activity.name].documentation += activity.documentation;
    });

    return totals; // Return total counts
  };

  const totalCounts = getTotalCounts(); // Get total counts for display

  return (
    <div className="container">
      <div className="sidebar">
        <div className="developer-select">
          <label htmlFor="developer-select">Select Developer: </label>
          <select id="developer-select" onChange={(e) => handleDeveloperChange(e.target.value)}>
            <option value="">All</option>
            {uniqueDevelopers.map(dev => (
              <option key={dev} value={dev}>{dev}</option>
            ))}
          </select>
        </div>
        <div className="buttons">
          {/* Buttons for selecting different metrics */}
          <button onClick={() => handleMetricChange('commits')} className={selectedMetric === 'commits' ? 'active' : ''}>Commits</button>
          <button onClick={() => handleMetricChange('pull_requests_opened')} className={selectedMetric === 'pull_requests_opened' ? 'active' : ''}>PRs Opened</button>
          <button onClick={() => handleMetricChange('pull_requests_merged')} className={selectedMetric === 'pull_requests_merged' ? 'active' : ''}>PRs Merged</button>
          <button onClick={() => handleMetricChange('meetings')} className={selectedMetric === 'meetings' ? 'active' : ''}>Meetings</button>
          <button onClick={() => handleMetricChange('documentation')} className={selectedMetric === 'documentation' ? 'active' : ''}>Documentation</button>
        </div>
      </div>
      <div className="content">
        <div className="chart-container">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Developer</th>
                <th>Commits</th>
                <th>PRs Opened</th>
                <th>PRs Merged</th>
                <th>Meetings</th>
                <th>Documentation</th>
              </tr>
            </thead>
            <tbody>
              {/* Render total counts for each developer, filtering by selected developer */}
              {uniqueDevelopers.filter(developer => !selectedDeveloper || developer === selectedDeveloper).map(developer => (
                <tr key={developer}>
                  <td>{developer}</td>
                  <td>{totalCounts[developer].commits}</td>
                  <td>{totalCounts[developer].pull_requests_opened}</td>
                  <td>{totalCounts[developer].pull_requests_merged}</td>
                  <td>{totalCounts[developer].meetings}</td>
                  <td>{totalCounts[developer].documentation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;

// Code to get data from json on localhost
// import React, { useEffect, useState } from 'react';
// import { fetchActivities } from '../services/api';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import Highcharts3D from 'highcharts/highcharts-3d';
// import './ActivityChart.css';

// Highcharts3D(Highcharts);

// interface Activity {
//   id: number;
//   date: string;
//   name: string;
//   commits: number;
//   pull_requests_opened: number;
//   pull_requests_merged: number;
//   meetings: number;
//   documentation: number;
// }

// type ActivityMetric = 'commits' | 'pull_requests_opened' | 'pull_requests_merged' | 'meetings' | 'documentation';

// const ActivityChart: React.FC = () => {
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
//   const [selectedMetric, setSelectedMetric] = useState<ActivityMetric>('commits');
//   const [selectedDeveloper, setSelectedDeveloper] = useState<string | null>(null);

//   useEffect(() => {
//     const getActivities = async () => {
//       const data = await fetchActivities();
//       setActivities(data);
//       setFilteredActivities(aggregateData(data));
//     };
//     getActivities();
//   }, []);

//   const handleMetricChange = (metric: ActivityMetric) => {
//     setSelectedMetric(metric);
//     filterActivities(metric, selectedDeveloper);
//   };

//   const handleDeveloperChange = (developer: string) => {
//     setSelectedDeveloper(developer);
//     filterActivities(selectedMetric, developer);
//   };

//   const aggregateData = (activities: Activity[]): Activity[] => {
//     const aggregated: { [key: string]: Activity } = {};

//     activities.forEach(activity => {
//       if (!aggregated[activity.date]) {
//         aggregated[activity.date] = {
//           id: activity.id,
//           date: activity.date,
//           name: 'All',
//           commits: 0,
//           pull_requests_opened: 0,
//           pull_requests_merged: 0,
//           meetings: 0,
//           documentation: 0,
//         };
//       }

//       aggregated[activity.date].commits += activity.commits;
//       aggregated[activity.date].pull_requests_opened += activity.pull_requests_opened;
//       aggregated[activity.date].pull_requests_merged += activity.pull_requests_merged;
//       aggregated[activity.date].meetings += activity.meetings;
//       aggregated[activity.date].documentation += activity.documentation;
//     });

//     return Object.values(aggregated);
//   };

//   const filterActivities = (metric: ActivityMetric, developer: string | null) => {
//     let filtered = activities.filter(activity =>
//       activity[metric] !== undefined && (developer ? activity.name === developer : true)
//     );

//     if (developer === null || developer === '') {
//       filtered = aggregateData(filtered);
//     }

//     setFilteredActivities(filtered);
//   };

//   const uniqueDevelopers = Array.from(new Set(activities.map(activity => activity.name)));

//   const pieChartData = filteredActivities.map(activity => ({
//     name: activity.date,
//     y: activity[selectedMetric],
//   }));

//   const options = {
//     chart: {
//       type: 'pie',
//       options3d: {
//         enabled: true,
//         alpha: 45,
//         beta: 0,
//       },
//     },
//     title: {
//       text: `Developer Activities: ${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}`,
//     },
//     tooltip: {
//       pointFormat: '{series.name}: <b>{point.y}</b>',
//     },
//     plotOptions: {
//       pie: {
//         allowPointSelect: true,
//         cursor: 'pointer',
//         depth: 35,
//         dataLabels: {
//           enabled: true,
//           format: '{point.name}: {point.y}',
//         },
//       },
//     },
//     series: [{
//       type: 'pie',
//       name: `${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}`,
//       data: pieChartData,
//     }],
//   };

//   const getTotalCounts = () => {
//     const totals: { [key: string]: { [key in ActivityMetric]: number } } = {};

//     activities.forEach(activity => {
//       if (!totals[activity.name]) {
//         totals[activity.name] = {
//           commits: 0,
//           pull_requests_opened: 0,
//           pull_requests_merged: 0,
//           meetings: 0,
//           documentation: 0,
//         };
//       }

//       totals[activity.name].commits += activity.commits;
//       totals[activity.name].pull_requests_opened += activity.pull_requests_opened;
//       totals[activity.name].pull_requests_merged += activity.pull_requests_merged;
//       totals[activity.name].meetings += activity.meetings;
//       totals[activity.name].documentation += activity.documentation;
//     });

//     return totals;
//   };

//   const totalCounts = getTotalCounts();

//   return (
//     <div className="container">
//       <div className="sidebar">
//         <div className="developer-select">
//           <label htmlFor="developer-select">Select Developer: </label>
//           <select id="developer-select" onChange={(e) => handleDeveloperChange(e.target.value)}>
//             <option value="">All</option>
//             {uniqueDevelopers.map(dev => (
//               <option key={dev} value={dev}>{dev}</option>
//             ))}
//           </select>
//         </div>
//         <div className="buttons">
//           <button onClick={() => handleMetricChange('commits')} className={selectedMetric === 'commits' ? 'active' : ''}>Commits</button>
//           <button onClick={() => handleMetricChange('pull_requests_opened')} className={selectedMetric === 'pull_requests_opened' ? 'active' : ''}>PRs Opened</button>
//           <button onClick={() => handleMetricChange('pull_requests_merged')} className={selectedMetric === 'pull_requests_merged' ? 'active' : ''}>PRs Merged</button>
//           <button onClick={() => handleMetricChange('meetings')} className={selectedMetric === 'meetings' ? 'active' : ''}>Meetings</button>
//           <button onClick={() => handleMetricChange('documentation')} className={selectedMetric === 'documentation' ? 'active' : ''}>Documentation</button>
//         </div>
//       </div>
//       <div className="content">
//         <div className="chart-container">
//           <HighchartsReact
//             highcharts={Highcharts}
//             options={options}
//           />
//         </div>
//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th>Developer</th>
//                 <th>Commits</th>
//                 <th>PRs Opened</th>
//                 <th>PRs Merged</th>
//                 <th>Meetings</th>
//                 <th>Documentation</th>
//               </tr>
//             </thead>
//             <tbody>
//               {uniqueDevelopers.map(developer => (
//                 <tr key={developer}>
//                   <td>{developer}</td>
//                   <td>{totalCounts[developer].commits}</td>
//                   <td>{totalCounts[developer].pull_requests_opened}</td>
//                   <td>{totalCounts[developer].pull_requests_merged}</td>
//                   <td>{totalCounts[developer].meetings}</td>
//                   <td>{totalCounts[developer].documentation}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActivityChart;
