export interface IEducationInput {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    order?: number;
}

export interface IEducationUpdateInput {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    order?: number;
}

export interface ILicenseInput {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialUrl?: string;
    order?: number;
}

export interface ILicenseUpdateInput {
    name?: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
    credentialUrl?: string;
    order?: number;
}

export interface IProjectInput {
    title: string;
    description: string;
    imageUrl?: string;
    demoUrl?: string;
    repoUrl?: string;
    techStack: string;
    order?: number;
}

export interface IProjectUpdateInput {
    title?: string;
    description?: string;
    imageUrl?: string;
    demoUrl?: string;
    repoUrl?: string;
    techStack?: string;
    order?: number;
}

export interface IAboutInput {
    fullName: string;
    title: string;
    bio: string;
    photoUrl?: string;
    faviconUrl?: string;
    tagline?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    contactLinks?: { label: string; value: string }[];
    skills?: { name: string; description: string }[];
    texts?: Record<string, string>;
    email?: string;
    phone?: string;
    location?: string;
}

export interface IContactMessageInput {
    name: string;
    email: string;
    message: string;
}