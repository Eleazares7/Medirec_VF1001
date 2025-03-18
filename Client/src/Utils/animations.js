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

const containerVariantsMedicalReport = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 50 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.6, type: 'spring', stiffness: 100, damping: 15 },
    },
    hover: {
        scale: 1.05,
        y: -10,
        rotate: 2,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

const iconVariants = {
    hover: {
        rotate: 360,
        transition: { duration: 1, ease: 'linear' },
    },
};


export default [
    childVariants,
    containerVariants,
    buttonVariants,
    containerVariantsMedicalReport,
    titleVariants,
    cardVariants,
    iconVariants
];
