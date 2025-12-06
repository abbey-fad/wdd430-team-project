import Link from 'next/link';
import React from 'react';

export default function NotFound() {
    return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                The page or product you are looking for could not be found.
            </p>
            <Link href="/seller" style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#0070f3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
            }}>
                Return to Seller Profile
            </Link>
        </div>
    );
}
