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
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Typeahead } from 'react-bootstrap-typeahead';
import { agenciesApi, chartDataApi, configureAxios, defaultDateRange, recentChangesApi } from './settings';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar'
import { Option } from 'react-bootstrap-typeahead/types/types';
import { aggregateByYearMonth } from './data';
import { RecentChangeItem } from './components/RecentChangeItem';
import { Accordion } from 'react-bootstrap';
import './App.css';
import { RecentChange, Agency } from './model';
import { description, header } from './components/text.props';
import Footer from './components/Footer';
import { Analytics } from "@vercel/analytics/react"

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
  const [suggestions, setSuggestions] = useState<Option[]>([]);
  const [selection, setSelection] = useState<Agency[]>([]);
  const [chartData, setChartData] = useState(undefined); // Your chart data here
  const [recentChanges, setRecentChanges] = useState<RecentChange[]>([]);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  useEffect(() => {

    configureAxios();

    axios.get(agenciesApi)
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
      .catch(error => {
console.log(error);
console.error('Error fetching agencies:', error)

});
  }, []);


  const filterByCallback = (option: Agency, props) =>
    option?.shortName?.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
    option?.name?.toLowerCase().indexOf(props.text.toLowerCase()) !== -1;


  const onChange = (opts: Agency[]) => {
    setSelection(opts);
    axios.get(chartDataApi, {
      params: {
        agency_slugs: [
          opts[0].slug
        ],
        ...defaultDateRange
      }
    })
      .then((response) => {
        const chart = aggregateByYearMonth(response.data)
        const data: ChartData = {
          labels: chart.labels,
          datasets: [
            {
              label: 'Dataset',
              fill: false,
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
      params: {
        ...defaultDateRange,
        agency_slugs: [
          opts[0].slug,
        ],
        per_page: '5',
        page: '1',
        order: 'newest_first',
        paginate_by: 'results'
      }
    })
      .then(response => {
        const { results } = response.data;
        const changes: RecentChange[] = results?.map((v) => {
          const { structure_index } = v;
          const { title, subtitle, chapter, part, section } = v.headings;
          const link = `title-${v.hierarchy.title}/chapter-${v.hierarchy.chapter}`
          return {
            key: structure_index,
            title,
            subtitle,
            chapter,
            part,
            section,
            link,
            hierarchy: {
              title: v.hierarchy_headings.title,
              chapter: v.hierarchy_headings.chapter,
              part: v.hierarchy_headings.part,
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
    <div className="d-flex flex-column min-vh-100">
      <Analytics mode={'production'} />
      <Container fluid className="flex-grow-1" style={{paddingBottom: '85px', paddingTop: '25px'}}>
        <Row className="justify-content-center align-items-center">
          <Col xs="auto">
            <img src="./eagle-2.png" alt="ECFR Explorer Logo" className='app-logo' />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="auto">
            <h1 className="text-center">{header}</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={10} md={8} lg={6}>
            <p className="text-center">{description}</p>
          </Col>
        </Row>
        <Row className="justify-content-center" style={{ padding: '25px' }}>
          <Col xs={10} md={8} lg={6}>
            <Typeahead
              id="agency-select"
              filterBy={filterByCallback}
              defaultOpen={false}
              labelKey="name"
              onChange={onChange}
              options={suggestions}
              placeholder="Choose an agency ..."
              selected={selection}
            />
          </Col>
        </Row>
        {isPanelVisible && (
          <Row className="justify-content-center" style={{ padding: '25px' }}>
            <Col xs={10} md={8} lg={6}>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Aggregate Chart</Accordion.Header>
                  <Accordion.Body>
                    <Line data={chartData} options={options} />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Last 5 submissions</Accordion.Header>
                  <Accordion.Body>
                    {
                      recentChanges.map((item: RecentChange) => <RecentChangeItem key={'k_' + item.key} item={item} />)
                    }
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default App;