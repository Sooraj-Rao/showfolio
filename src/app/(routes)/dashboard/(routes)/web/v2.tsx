"use client";

import React from "react";
import styled from "styled-components";
import { dummyData } from "@/lib/data";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Montserrat", sans-serif;
  background-color: #1a1a2e;
  color: #e94560;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #0f3460;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ProfileImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  border: 8px solid #0f3460;
`;

const SkillsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  list-style-type: none;
  padding: 0;
`;

const SkillItem = styled.li`
  background-color: #0f3460;
  color: #e94560;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: bold;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled.div`
  background-color: #16213e;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const SocialLink = styled.a`
  color: #e94560;
  font-size: 1.8rem;
  transition: color 0.3s ease;

  &:hover {
    color: #0f3460;
  }
`;

export default function Portfolio() {
  const { profile, about, skills, education, projects, experience, contact } =
    dummyData;

  return (
    <PageContainer>
      <Header>
        <ProfileSection>
          <ProfileImage src={profile.avatar} alt={profile.name} />
          <h1
            style={{
              fontSize: "3.5rem",
              marginBottom: "0.5rem",
              color: "#0f3460",
            }}
          >
            {profile.name}
          </h1>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "normal" }}>
            {profile.title}
          </h2>
        </ProfileSection>
      </Header>

      <Section>
        <SectionTitle>About Me</SectionTitle>
        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>{about}</p>
      </Section>

      <Section>
        <SectionTitle>Skills</SectionTitle>
        <SkillsList>
          {skills.map((skill, index) => (
            <SkillItem key={index}>{skill}</SkillItem>
          ))}
        </SkillsList>
      </Section>

      <Section>
        <SectionTitle>Education</SectionTitle>
        {education.map((edu, index) => (
          <div
            key={index}
            style={{ marginBottom: "2rem", textAlign: "center" }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.5rem",
                color: "#0f3460",
              }}
            >
              {edu.institution}
            </h3>
            <p style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>
              {edu.degree}
            </p>
            <p style={{ marginBottom: "0.5rem", color: "#16213e" }}>
              {edu.duration}
            </p>
            <p>{edu.description}</p>
          </div>
        ))}
      </Section>

      <Section>
        <SectionTitle>Projects</SectionTitle>
        <ProjectGrid>
          {projects.map((project, index) => (
            <ProjectCard key={index}>
              <ProjectImage src={project.image} alt={project.title} />
              <ProjectInfo>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "1rem",
                    color: "#0f3460",
                  }}
                >
                  {project.title}
                </h3>
                <p>{project.description}</p>
              </ProjectInfo>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Section>

      <Section>
        <SectionTitle>Experience</SectionTitle>
        {experience.map((exp, index) => (
          <div
            key={index}
            style={{ marginBottom: "2rem", textAlign: "center" }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.5rem",
                color: "#0f3460",
              }}
            >
              {exp.company}
            </h3>
            <p
              style={{
                fontWeight: "bold",
                marginBottom: "0.25rem",
                fontSize: "1.2rem",
              }}
            >
              {exp.position}
            </p>
            <p style={{ color: "#16213e", marginBottom: "0.5rem" }}>
              {exp.duration}
            </p>
            <p>{exp.description}</p>
          </div>
        ))}
      </Section>

      <Section>
        <SectionTitle>Contact</SectionTitle>
        <ContactInfo>
          <p>Email: {contact.email}</p>
          <p>Phone: {contact.phone}</p>
          <p>Location: {contact.location}</p>
          <SocialLinks>
            {contact.social.map((item, index) => (
              <SocialLink
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.platform}
              </SocialLink>
            ))}
          </SocialLinks>
        </ContactInfo>
      </Section>
    </PageContainer>
  );
}
