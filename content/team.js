/*
  TEAM PAGE
  To add a person:
    1. Put a square photo (about 500 x 500 px, .jpg) in  assets/img/team/
    2. Copy one { ... } block below, paste it into the right group, and change the text.
    3. "photo" is just the file name, e.g. 'smith.jpg'. Leave it '' to show their initials instead.
    4. "link" can be a university profile or LinkedIn. Leave it '' for no link.
  To remove a person: delete their { ... } block (and the comma after it).
  To add a group: copy a whole { title: ..., people: [ ... ] } block.
  The "People on the team" number counts itself.
*/
window.TEAM = {
  stats: {
    summary: 'One team across Calgary, Basel and Bern.',
    institutions: 4,
    countries: 2,
  },

  groups: [
    {
      title: 'Founders',
      people: [
        {
          name: 'Dr. Matthias Amrein',
          role: 'Professor, Biomedical Engineering, University of Calgary',
          focus: 'Microscopy and instrumentation',
          photo: 'amrein.jpg',
          link: 'https://profiles.ucalgary.ca/matthias-walter-amrein',
          linkLabel: 'Profile',
        },
        {
          name: 'Dr. Salvatore Federico',
          role: 'Professor, Mechanical Engineering, University of Calgary',
          focus: 'Biomechanics, FEA and kinematics',
          photo: 'federico.jpg',
          link: 'https://profiles.ucalgary.ca/salvatore-federico',
          linkLabel: 'Profile',
        },
        {
          name: 'Matthew Topham',
          role: 'MD/MSc, University of Calgary',
          focus: 'CAD, FEA and 3D printing',
          photo: 'topham.jpg',
          link: 'https://www.linkedin.com/in/matthewjtopham/',
          linkLabel: 'LinkedIn',
        },
      ],
    },

    {
      title: 'Faculty, clinicians & advisors',
      people: [
        {
          name: 'Dr. Kartik Murari',
          role: 'Associate Professor, Electrical Engineering, University of Calgary',
          focus: 'Instrumentation, actuation and system integration',
          photo: 'murari.jpg',
          link: 'https://profiles.ucalgary.ca/kartikeya-murari',
          linkLabel: 'Profile',
        },
        {
          name: 'Dr. Tito Daodu',
          role: 'Assistant Professor, Medicine, University of Calgary',
          focus: 'Pediatric surgeon; global health equity and access',
          photo: 'daodu.jpg',
          link: 'https://cumming.ucalgary.ca/departments/surgery/about/faculty-directory/tito-daodu',
          linkLabel: 'Profile',
        },
        {
          name: 'Dr. Liliam Salm',
          role: 'Abdominal Surgeon, Inselspital Bern',
          focus: 'Adhesion biology, inflammation and minimally invasive surgery',
          photo: 'salm.jpg',
          link: 'https://www.medizin.unibe.ch/profiles/university_clinics_inselspital/department_of_visceral_surgery_and_medicine/index_eng.html',
          linkLabel: 'Profile',
        },
        {
          name: 'Dr. Pascal Detampel',
          role: 'Senior Scientist, Pharmaceutical Technology, University of Basel',
          focus: 'Compliance and regulatory (qualified person)',
          photo: 'detampel.jpg',
          link: 'https://pharma.unibas.ch/en/persons/detampel-pascal/',
          linkLabel: 'Profile',
        },
        {
          name: 'Moritz Reinders',
          role: 'Robotics Expert, Eraneos',
          focus: 'Robotics platforms, project management and prototyping',
          photo: 'reinders.jpg',
          link: 'https://www.eraneos.com/our-people/',
          linkLabel: 'Profile',
        },
      ],
    },

    {
      title: 'Students · Serpento Lab',
      people: [
        {
          name: 'Hasan Waheed',
          role: 'MSc, Biomedical Engineering, University of Calgary',
          focus: 'Graduate researcher, Serpento Lab',
          photo: 'waheed.jpg',
          link: '',
        },
        {
          name: 'Sana Wahab',
          role: 'MSc, Health Economics, University of Calgary',
          focus: 'Graduate researcher, Serpento Lab',
          photo: 'wahab.jpg',
          link: '',
        },
        {
          name: 'Asher VanderDeen',
          role: 'Summer Research Student, 2026',
          focus: 'Serpento Lab',
          photo: 'vanderdeen.jpg',
          link: '',
        },
      ],
    },
  ],
};
