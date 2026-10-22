import { AboutRepository } from '../repositories/aboutRepository';
import { IAboutInput } from '../types/interfaces';

export class AboutService {
  constructor(private aboutRepository: AboutRepository) {}

  get() {
    return this.aboutRepository.find();
  }

  async save(input: IAboutInput) {
    return this.aboutRepository.upsert({
      fullName: input.fullName,
      title: input.title,
      bio: input.bio,
      photoUrl: input.photoUrl,
      faviconUrl: input.faviconUrl,
      tagline: input.tagline,
      linkedinUrl: input.linkedinUrl,
      githubUrl: input.githubUrl,
      contactLinks: input.contactLinks,
      texts: input.texts,
      email: input.email,
      phone: input.phone,
      location: input.location,
    });
  }
}