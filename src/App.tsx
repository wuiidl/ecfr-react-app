import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Typeahead } from 'react-bootstrap-typeahead';
import { agenciesApi, axiosConfig, chartDataApi, defaultDateRange, recentChangesApi } from './shared';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { aggregateByYearMonth } from './data';
import { RecentChangeItem } from './RecentChangeItem';


export interface Agency {
  name: string;
  shortName: string;
  slug: string;
}

export interface RecentChange {
  title: string;
  subtitle: string;
  chapter: string;
  hierarchy: Hierarchy;
}

export interface Hierarchy {
  title: string;
  chapter: string;
  part: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [selection, setSelection] = useState<Agency[]>([]);
  const [chartData, setChartData] = useState({}); // Your chart data here
  const [recentChanges, setRecentChanges] = useState([]);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  // const [recentChanges, setRecentChanges] = useState([]);

  useEffect(() => {
    axios.get(agenciesApi, axiosConfig)
      .then(response => {
        const { agencies } = response.data;
        const ags = agencies.map((value: { name: string, slug: string, short_name: string }) => {
          const { name, slug, short_name } = value;
          return {
            name,
            shortName: short_name,
            slug,
          };
        })
        setSuggestions(ags);
      })
      .catch(error => console.error('Error fetching agencies:', error));
  }, []);


  const filterByCallback = (option: Option, props) =>
    option?.shortName?.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
    option?.name?.toLowerCase().indexOf(props.text.toLowerCase()) !== -1;


  const onChange = (opts: Option[]) => {
    setSelection(opts);
    console.log(opts)

    axios.get(chartDataApi, {
      ...axiosConfig,
      params: {
        agency_slugs: [
          opts[0].slug
        ],
        ...defaultDateRange
      }
    })
      .then((response) => {
        const chart = aggregateByYearMonth(response.data)
        const data = {
          labels: chart.labels,
          datasets: [
            {
              label: 'Dataset',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: chart.data,
            }
          ]
        };
        setChartData(data);
        setIsPanelVisible(true);
      });

    axios.get(recentChangesApi, {
      ...axiosConfig,
      params: {
        ...defaultDateRange,
        agency_slugs: [
          opts[0].slug
        ],
        per_page: '5',
        page: '1',
        order: 'newest_first',
        paginate_by: 'results'
      }
    })
      .then(response => {
        const { results } = response.data;
        console.log(results);
        const changes: RecentChange[] = results?.map((v) => {
          const { title, subtitle, chapter } = v.headings;
          const { part } = v.hierarchy_headings;
          return {
            title,
            subtitle,
            chapter,
            hierarchy: {
              title: v.hierarchy_headings.title,
              chapter: v.hierarchy_headings.chapter,
              part,
            }
          };
        })
        setRecentChanges(changes)
      });

  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Aggregated Monthly Changes',
      },
    },
  };

  return (
    <Container fluid="lg">
      <Row className="justify-content-md-center">
        <Col>
          <img src="https://imagedelivery.net/Eq3GW7G6_BQgeWvh9nuCig/194f0beb-51d5-4623-64c3-462cbf5a5800/public" alt="ECFR Explorer Logo" className="app-logo" />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <h1>ECFR Explorer</h1>
      </Row>
      <Row>
        <Typeahead
          id="agency-select"
          filterBy={filterByCallback}
          defaultOpen={false}
          labelKey="name"
          onChange={(opt) => onChange(opt)}
          options={suggestions}
          placeholder="Choose an agency ..."
          selected={selection}
        />
      </Row>
      {isPanelVisible && (
        <Stack>
          <Line data={chartData} options={options} />
          <Row>
            <h2>5 most recent changes</h2>
          </Row>
          <Row>
            {
              recentChanges.map((item: RecentChange) => <RecentChangeItem item={item} />)
            }
          </Row>
        </Stack>)}
    </Container>
  );
}

export default App;