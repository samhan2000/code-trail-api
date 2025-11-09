export interface NewLessonDTO {
    title: string,
    description?: string,
    notes?: string,
    code?: string,
    userId: string,
    moduleId?: string,
    moduleSlug?: string,
}