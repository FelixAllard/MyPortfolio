import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { useTranslation } from "react-i18next";

function AboutCard() {
  const { t } = useTranslation("aboutcard");

  return (
      <Card className="quote-card-view">
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p style={{ textAlign: "justify" }}>
              {t("intro1")} <span className="purple">Felix Allard</span> {t("from")}
              <span className="purple">Montreal, Canada.</span>
              <br />
              {t("studentAt")} <span className="purple">Champlain College St-Lambert</span>
              <br />
              {t("pursuingDegree")}
              <br />
              <br />
              {t("apartFromCoding")}
            </p>
            <ul>
              <li className="about-activity">
                <ImPointRight /> {t("playingGames")}
              </li>
              <li className="about-activity">
                <ImPointRight /> {t("moddingGames")}
              </li>
              <li className="about-activity">
                <ImPointRight /> {t("creatingProjects")}
              </li>
            </ul>

            <p style={{ color: "rgb(155 126 172)" }}>
              {t("quote")}
            </p>
            <footer className="blockquote-footer">{t("footer")}</footer>
          </blockquote>
        </Card.Body>
      </Card>
  );
}

export default AboutCard;
