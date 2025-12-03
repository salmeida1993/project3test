import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";

export default function TripStats({ trips, visitedStates }) {
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [totalStates, setTotalStates] = useState(0);

  useEffect(() => {
    let tripsCount = trips.length;
    let expensesSum = 0;
    let daysSum = 0;
    let stateCount = visitedStates.length;

    trips.forEach((trip) => {
      // Sum expenses
      if (trip.expenses) {
        Object.values(trip.expenses).forEach((value) => {
          expensesSum += Number(value) || 0;
        });
      }
      // Sum days
      if (trip.startDate && trip.endDate) {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        // Calculate difference in days - difference is in milliseconds, convert to days
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        daysSum += days;
      }
    });

    setTotalTrips(tripsCount);
    setTotalExpenses(expensesSum);
    setTotalDays(daysSum);
    setTotalStates(stateCount);
  }, [trips, visitedStates]);

  return (
    <div className="mb-4">
        <Row xs={1} md={4} className="g-3">
            <Col>
                <Card className="text-center stats-card">
                    <Card.Body>
                        <Card.Title>Total States</Card.Title>
                        <Card.Text className="stats-card-states">{totalStates} / 51*</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className="text-center stats-card">
                    <Card.Body>
                        <Card.Title>Total Trips</Card.Title>
                        <Card.Text>{totalTrips}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className="text-center stats-card">
                    <Card.Body>
                        <Card.Title>Total Expenses</Card.Title>
                        <Card.Text>${totalExpenses.toFixed(2)}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className="text-center stats-card">
                    <Card.Body>
                        <Card.Title>Total Days</Card.Title>
                        <Card.Text>{totalDays}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
  );
}
