import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Felix Allard </span>
            from <span className="purple"> Montreal, Canada.</span>
            <br />
            I am currently a student at Champlain College St-Lambert
            <br />
            I am currently pursuing a degree in Computer Science and mathematics.
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Modding Video Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Creating Projects
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"{" "}
          </p>
          <footer className="blockquote-footer">Allard</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
