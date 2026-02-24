import CourseClient from "./CourseClient";

// Static IDs for demo courses to get generated natively as HTML
export function generateStaticParams() {
    return [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
        { id: 'demo-1' },
        { id: 'demo-2' },
        { id: 'demo-3' },
    ];
}

export default function CoursePage({ params }: any) {
    return <CourseClient />;
}
