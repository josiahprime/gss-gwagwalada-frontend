import { useState, useEffect } from 'react';

const useScrollDirection = (initialDirection: 'up' | 'down' | 'initial' = 'initial', threshold: number = 50) => {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'initial'>(initialDirection);

    useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const updateScrollDirection = () => {
            const scrollY = window.pageYOffset;
            
            if (Math.abs(scrollY - lastScrollY) < threshold) {
                return;
            }

            if (scrollY > lastScrollY && scrollY > threshold) {
                setScrollDirection('down');
            } else if (scrollY < lastScrollY && scrollY > threshold) {
                setScrollDirection('up');
            } else if (scrollY < threshold) {
                 setScrollDirection('initial');
            }
            
            lastScrollY = scrollY;
        };

        window.addEventListener('scroll', updateScrollDirection);
        
        return () => {
            window.removeEventListener('scroll', updateScrollDirection);
        };
    }, [threshold]);

    return scrollDirection;
};

export default useScrollDirection;