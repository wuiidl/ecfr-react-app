import { Col, Row, Stack } from "react-bootstrap";
import { RecentChange } from "./App";

// /current/title-2/subtitle-A/chapter-I/part-170/subpart-B/section-170.200

export const RecentChangeItem = (props: { item: RecentChange }) => {

    const { item } = props;
    const url = 'https://www.ecfr.gov/current/' + item.link + '?toc=1';
    return (
        <Row className="justify-content-center full-width-row">
            <Col>
                <div>
                    <span style={{ fontWeight: 'bold', color: 'black' }}>{item.hierarchy.title} - {item.hierarchy.chapter} - {item.hierarchy.part}</span>
                </div>
                <div style={{ fontSize: 'smaller', fontStyle: 'italic' }}>
                    <a href={url} target="_blank" rel="noopener noreferrer"><span>{item.section ?? item.subtitle}</span></a>
                </div>
            </Col>
        </Row>
    );
}