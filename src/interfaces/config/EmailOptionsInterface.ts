export interface EmailOptionsInterface {
    to: string;
    subject: string;
    templateName: string;
    context: Record<string, string>;
}
