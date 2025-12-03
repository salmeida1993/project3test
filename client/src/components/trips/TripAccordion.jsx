import { Accordion, Card, Row, Col, Button } from "react-bootstrap";

export default function TripAccordion({ trips, onEdit, onDelete }) {
  if (!trips || trips.length === 0) {
    return (
      <p className="text-muted">
        No trips added yet. Go and add your first trip!
      </p>
    );
  }

  return (
    <Accordion alwaysOpen>
      {trips.map((trip, index) => (
        <Accordion.Item eventKey={trip._id} key={trip._id || index}>
          <Accordion.Header>
            <strong>{trip.title}</strong>
            <span className="text-muted ms-2">
              ({trip.startDate} - {trip.endDate})
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <p>{trip.description}</p>

            {/* Legs of the trip */}
            {trip.legs && trip.legs.length > 0 && (
              <>
                <h5 className="mb-3">Legs</h5>
                <Row xs={1} md={2} lg={4} className="g-3">
                  {trip.legs.map((leg, legIndex) => (
                    <Col key={leg._id || legIndex}>
                      <Card className="accordion-card h-100">
                        <Card.Body>
                          <Card.Title>
                            {leg.city}, {leg.state}
                          </Card.Title>
                          <Card.Text>
                            <strong>Days:</strong> {leg.days}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {/* Expenses */}
            {trip.expenses && (
              <>
                <h5 className="mt-4 mb-3">Expenses</h5>
                <Row xs={1} md={2} lg={4} className="g-3">
                  {Object.entries(trip.expenses).map(([key, value]) => (
                    <Col key={key}>
                      <Card className="accordion-card h-100">
                        <Card.Body>
                          <Card.Title className="text-capitalize">
                            {key}
                          </Card.Title>
                          <Card.Text>
                            <strong>${Number(value).toFixed(2)}</strong>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Row className="g-3 mt-1">
                  <Col>
                    <Card className="accordion-card h-100">
                      <Card.Body>
                        <Card.Title>Total Expense</Card.Title>
                        <Card.Text>
                          <strong>
                            $
                            {Number(
                              Object.values(trip.expenses).reduce(
                                (sum, val) => sum + val,
                                0
                              )
                            ).toFixed(2)}
                          </strong>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}

            {/* Notes */}
            {trip.notes && (
              <>
                <h5 className="mt-4">Notes</h5>
                <p>{trip.notes}</p>
              </>
            )}

            {/* Edit and Delete Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEdit(trip)}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(trip)}
              >
                Delete
              </Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
