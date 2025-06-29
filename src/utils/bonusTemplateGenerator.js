import * as XLSX from 'xlsx'
import { downloadFinancialBonusTemplate } from './financialBonusTemplates'

// ATS-Optimized Resume Template Generator
export const generateATSResumeTemplate = () => {
  const workbook = XLSX.utils.book_new()
  
  // Resume template data
  const resumeTemplate = [
    ['ATS-OPTIMIZED RESUME TEMPLATE'],
    [''],
    ['[Your Full Name]'],
    ['[Your Phone Number] | [Your Email] | [Your LinkedIn] | [Your Location]'],
    [''],
    ['PROFESSIONAL SUMMARY'],
    ['[Write 2-3 sentences highlighting your key qualifications and career objectives.'],
    ['Focus on skills and achievements relevant to your target role.]'],
    [''],
    ['CORE COMPETENCIES'],
    ['• [Skill 1 - use keywords from job description]'],
    ['• [Skill 2 - use keywords from job description]'],
    ['• [Skill 3 - use keywords from job description]'],
    ['• [Skill 4 - use keywords from job description]'],
    ['• [Skill 5 - use keywords from job description]'],
    ['• [Skill 6 - use keywords from job description]'],
    [''],
    ['PROFESSIONAL EXPERIENCE'],
    [''],
    ['[Job Title] | [Company Name] | [Start Date] - [End Date]'],
    ['• [Achievement with quantified results - increased X by Y%]'],
    ['• [Achievement with quantified results - managed team of X people]'],
    ['• [Achievement with quantified results - reduced costs by $X]'],
    ['• [Achievement demonstrating relevant skills]'],
    [''],
    ['[Job Title] | [Company Name] | [Start Date] - [End Date]'],
    ['• [Achievement with quantified results]'],
    ['• [Achievement with quantified results]'],
    ['• [Achievement demonstrating relevant skills]'],
    [''],
    ['EDUCATION'],
    ['[Degree] in [Field of Study] | [University Name] | [Graduation Year]'],
    ['[Relevant coursework, honors, or GPA if beneficial]'],
    [''],
    ['CERTIFICATIONS & TRAINING'],
    ['• [Certification Name] - [Issuing Organization] ([Year])'],
    ['• [Training/Course Name] - [Platform/Institution] ([Year])'],
    [''],
    ['TECHNICAL SKILLS'],
    ['Software: [List relevant software and tools]'],
    ['Programming: [If applicable]'],
    ['Languages: [If applicable]'],
    [''],
    ['INSTRUCTIONS:'],
    ['1. Replace all bracketed placeholders with your information'],
    ['2. Use keywords from target job descriptions'],
    ['3. Quantify achievements with numbers and percentages'],
    ['4. Keep formatting simple for ATS compatibility'],
    ['5. Save as both .docx and .pdf formats'],
    ['6. Tailor for each application']
  ]
  
  const worksheet = XLSX.utils.aoa_to_sheet(resumeTemplate)
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ATS Resume Template')
  
  // Style the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref'])
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({r: R, c: C})
      if (worksheet[cellAddress]) {
        // Make headers bold
        if (R === 0 || worksheet[cellAddress].v.includes('PROFESSIONAL') || 
            worksheet[cellAddress].v.includes('CORE COMPETENCIES') || 
            worksheet[cellAddress].v.includes('EDUCATION') || 
            worksheet[cellAddress].v.includes('CERTIFICATIONS') || 
            worksheet[cellAddress].v.includes('TECHNICAL SKILLS')) {
          worksheet[cellAddress].s = { font: { bold: true } }
        }
      }
    }
  }
  
  return workbook
}

// Cover Letter Template Generator
export const generateCoverLetterTemplate = () => {
  const template = `
WINNING COVER LETTER TEMPLATE

[Your Name]
[Your Address]
[City, State ZIP Code]
[Your Email]
[Your Phone]

[Date]

[Hiring Manager's Name]
[Title]
[Company Name]
[Company Address]
[City, State ZIP Code]

Dear [Hiring Manager's Name / Hiring Team],

OPENING PARAGRAPH - The Hook
[Start with an attention-grabbing opening that shows enthusiasm and mentions the specific position. Example: "I was thrilled to discover the [Job Title] position at [Company Name] on [where you found it]. With my [relevant experience/skill], I'm excited to contribute to [company goal/mission]."]

BODY PARAGRAPH 1 - Your Relevant Experience
[Highlight your most relevant experience and a quantified achievement. Example: "In my role as [previous position] at [company], I [specific achievement with numbers]. This experience directly aligns with your need for [job requirement from posting]."]

BODY PARAGRAPH 2 - Soft Skills & Company Connection
[Showcase a key soft skill with a brief story, then connect to the company. Example: "My strength in [soft skill] was demonstrated when [brief story]. I'm particularly drawn to [Company Name] because [specific reason related to company values/mission]."]

CLOSING PARAGRAPH - Call to Action
[Summarize your interest and request next steps. Example: "I would welcome the opportunity to discuss how my [key qualification] can contribute to [company goal]. Thank you for your consideration, and I look forward to hearing from you."]

Sincerely,
[Your Name]

CUSTOMIZATION CHECKLIST:
□ Research the company and hiring manager's name
□ Include specific keywords from job description
□ Quantify at least one achievement
□ Mention the company's mission/values
□ Proofread for grammar and spelling
□ Keep to one page maximum
□ Save as PDF for application

COMMON MISTAKES TO AVOID:
• Using "To Whom It May Concern"
• Generic, template-sounding language
• Repeating your resume exactly
• Focusing on what you want vs. what you offer
• Forgetting to customize for each application
`
  
  const blob = new Blob([template], { type: 'text/plain' })
  return blob
}

// AI Prompts Library Generator
export const generateAIPromptsLibrary = () => {
  const prompts = {
    'Resume Optimization': [
      'Rewrite this resume bullet point to be more ATS-friendly and include relevant keywords: [paste bullet point]',
      'Optimize this professional summary for a [job title] role in [industry]: [paste current summary]',
      'Suggest 5 strong action verbs to replace weak verbs in this experience: [paste experience]',
      'Create 3 versions of this achievement with different keyword focus: [paste achievement]'
    ],
    'Cover Letter Writing': [
      'Write an engaging opening paragraph for a cover letter for [job title] at [company name]',
      'Help me connect this experience to the job requirements: Experience: [paste] Job Requirements: [paste]',
      'Suggest ways to show cultural fit with this company: [paste company info/values]',
      'Create a compelling closing paragraph that includes a call to action'
    ],
    'LinkedIn Optimization': [
      'Write a compelling LinkedIn headline for someone transitioning from [current role] to [target role]',
      'Create a LinkedIn summary that highlights these key skills: [list skills]',
      'Suggest LinkedIn post ideas to showcase expertise in [your field]',
      'Write connection request messages for [type of professional you want to connect with]'
    ],
    'Interview Preparation': [
      'Help me prepare STAR method answers for these common questions: [list questions]',
      'What questions should I ask about [specific aspect] during my interview?',
      'Help me explain this career gap positively: [describe situation]',
      'Practice explaining why I want to work at [company name] based on [company info]'
    ],
    'Job Search Strategy': [
      'Identify companies in [location/industry] that value [your key skills/values]',
      'Suggest networking strategies for someone in [your industry/role]',
      'Help me set up job alerts with these criteria: [list criteria]',
      'Create a follow-up email template for after submitting applications'
    ]
  }
  
  let content = 'AI JOB SEARCH PROMPT LIBRARY\n'
  content += '50+ Proven Prompts to Supercharge Your Job Search\n\n'
  
  Object.entries(prompts).forEach(([category, promptList]) => {
    content += `${category.toUpperCase()}\n`
    content += '='.repeat(category.length) + '\n\n'
    promptList.forEach((prompt, index) => {
      content += `${index + 1}. ${prompt}\n\n`
    })
    content += '\n'
  })
  
  content += `
HOW TO USE THESE PROMPTS:

1. Copy the prompt that matches your need
2. Replace bracketed placeholders with your specific information
3. Paste into your preferred AI tool (ChatGPT, Claude, etc.)
4. Refine the output by asking follow-up questions
5. Always review and personalize AI-generated content

PRO TIPS:
• Be specific with your input for better results
• Ask for multiple versions to compare options
• Use AI as a starting point, then add your personal touch
• Test different prompts to see what works best for you
• Save successful prompts for future use
`
  
  const blob = new Blob([content], { type: 'text/plain' })
  return blob
}

// Interview Checklist Generator
export const generateInterviewChecklist = () => {
  const checklist = `
INTERVIEW MASTERY CHECKLIST
Your Complete Guide to Acing Any Interview

PRE-INTERVIEW PREPARATION (1-2 WEEKS BEFORE)
□ Research the company thoroughly (mission, values, recent news)
□ Study the job description and requirements
□ Review your resume and be ready to discuss each point
□ Prepare STAR method stories for common behavioral questions
□ Research the interviewer(s) on LinkedIn if possible
□ Prepare 5-7 thoughtful questions to ask them
□ Practice your elevator pitch (30-60 second intro)
□ Plan your route/test technology for virtual interviews

TECHNICAL PREPARATION (3-5 DAYS BEFORE)
□ Set up and test video call technology (Zoom, Teams, etc.)
□ Check camera angle, lighting, and audio quality
□ Choose and prepare your interview outfit
□ Prepare a quiet, professional background space
□ Print extra copies of your resume and references
□ Gather any portfolio materials or work samples
□ Prepare a notepad and working pen

DAY OF INTERVIEW
□ Get a good night's sleep and eat a proper meal
□ Arrive 10-15 minutes early (or log in early for virtual)
□ Bring extra copies of resume, references, and notepad
□ Turn off phone notifications
□ Use the restroom and check your appearance
□ Take deep breaths and maintain positive mindset

DURING THE INTERVIEW
□ Make strong eye contact and offer firm handshake
□ Listen actively and take notes when appropriate
□ Answer questions using specific examples
□ Ask clarifying questions if needed
□ Show enthusiasm for the role and company
□ Ask your prepared questions about the role/company
□ Discuss next steps and timeline

VIRTUAL INTERVIEW SPECIFIC
□ Test all technology 30 minutes before
□ Have backup plan (phone number, alternative device)
□ Look at camera, not screen, when speaking
□ Keep notes and water nearby but out of view
□ Minimize distractions (close other apps, silence notifications)
□ Have good lighting facing you
□ Sit up straight with professional posture

POST-INTERVIEW (WITHIN 24 HOURS)
□ Send thank-you email to interviewer(s)
□ Reiterate interest and key qualifications
□ Address any concerns that came up during interview
□ Connect on LinkedIn if appropriate
□ Follow up on any promised information or materials
□ Reflect on what went well and areas for improvement

COMMON INTERVIEW QUESTIONS TO PREPARE FOR:
□ "Tell me about yourself"
□ "Why do you want this position?"
□ "Why do you want to work here?"
□ "What are your greatest strengths?"
□ "What is your biggest weakness?"
□ "Where do you see yourself in 5 years?"
□ "Tell me about a challenge you overcame"
□ "Describe a time you worked in a team"
□ "How do you handle stress and pressure?"
□ "Do you have any questions for us?"

QUESTIONS TO ASK THE INTERVIEWER:
□ "What does a typical day look like in this role?"
□ "What are the biggest challenges facing the team/department?"
□ "How do you measure success in this position?"
□ "What opportunities for growth and development exist?"
□ "What do you enjoy most about working here?"
□ "What are the next steps in the interview process?"

RED FLAGS TO WATCH FOR:
□ Vague job descriptions or responsibilities
□ High turnover mentions
□ Negative comments about previous employees
□ Pressure to make immediate decisions
□ Requests for personal financial information
□ Unprofessional interview environment or behavior

SALARY NEGOTIATION PREPARATION:
□ Research market rates for the position
□ Know your minimum acceptable salary
□ Prepare to discuss total compensation package
□ Practice salary negotiation conversations
□ Wait for them to bring up salary first if possible

Remember: Interviews are conversations, not interrogations. 
Show genuine interest, be yourself, and let your personality shine through!
`
  
  const blob = new Blob([checklist], { type: 'text/plain' })
  return blob
}

export const downloadBonusTemplate = (templateType) => {
  let blob, filename
  
  switch (templateType) {
    case 'resume':
      const resumeWorkbook = generateATSResumeTemplate()
      XLSX.writeFile(resumeWorkbook, 'ATS-Optimized-Resume-Template.xlsx')
      return
      
    case 'cover-letter':
      blob = generateCoverLetterTemplate()
      filename = 'Winning-Cover-Letter-Template.txt'
      break
      
    case 'ai-prompts':
      blob = generateAIPromptsLibrary()
      filename = 'AI-Job-Search-Prompts-Library.txt'
      break
      
    case 'interview-checklist':
      blob = generateInterviewChecklist()
      filename = 'Interview-Mastery-Checklist.txt'
      break
      
    // Financial Freedom templates
    case 'money-map':
    case 'debt-demolisher':
    case 'portfolio-guide':
    case 'goal-setter':
      downloadFinancialBonusTemplate(templateType)
      return
      
    default:
      return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}