import React from "react";
import Typewriter from "typewriter-effect";
import { useTranslation } from "react-i18next";

function Type() {
    const { t } = useTranslation("typewriter"); // Assuming you use the same namespace

    return (
        <Typewriter
            options={{
                strings: [
                    t("softwareDeveloper"),
                    t("freelancer"),
                    t("webDeveloper"),
                    t("gameProgrammer"),
                ],
                autoStart: true,
                loop: true,
                deleteSpeed: 50,
            }}
        />
    );
}

export default Type;
