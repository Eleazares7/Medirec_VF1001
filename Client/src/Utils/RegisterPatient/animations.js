const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.3 },
    },
};

const childVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: 'easeInOut',
        },
    },
    exit: {
        opacity: 0,
        x: -50,
        transition: {
            duration: 0.7,
            ease: 'easeInOut',
        },
    },
};

const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
    pulse: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity } },
};

export default [childVariants, containerVariants, buttonVariants];
