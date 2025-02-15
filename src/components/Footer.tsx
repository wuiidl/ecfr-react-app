import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
const Footer = () => {
  return (
    <footer className="footer fixed-bottom bg-light">
      <Container>
        <Row style={{padding: '15px'}}>
          <Col className="text-center">
            <a href="https://github.com/wuiidl/ecfr-react-app" target="_blank" rel="noopener noreferrer" className="text-dark">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;