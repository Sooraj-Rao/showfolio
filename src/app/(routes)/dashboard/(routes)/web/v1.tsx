"use client";

import React from "react";
import styled from "styled-components";
import { dummyData } from "@/lib/data";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  background-color: #f0f4f8;
  color: #1a202c;
`;

const Header = styled.header`
  background-color: #4a5568;
  color: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #4a5568;
  margin-bottom: 1rem;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #4a5568;
`;

const SkillsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style-type: none;
  padding: 0;
`;

const SkillItem = styled.li`
  background-color: #4a5568;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled.div`
  background-color: #edf2f7;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
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
  gap: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  color: #4a5568;
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #2d3748;
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
          <div>
            <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
              {profile.name}
            </h1>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "normal" }}>
              {profile.title}
            </h2>
          </div>
        </ProfileSection>
      </Header>

      <Section>
        <SectionTitle>About Me</SectionTitle>
        <p>{about}</p>
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
          <div key={index} style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {edu.institution}
            </h3>
            <p style={{ marginBottom: "0.25rem" }}>{edu.degree}</p>
            <p style={{ marginBottom: "0.25rem", color: "#718096" }}>
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
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
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
          <div key={index} style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {exp.company}
            </h3>
            <p style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
              {exp.position}
            </p>
            <p style={{ color: "#718096", marginBottom: "0.5rem" }}>
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
