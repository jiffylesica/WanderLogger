import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import ReturnHome from './ReturnHomeButton';
import { useRouter } from 'next/router';

export default function Header() {
    const router = useRouter();

    return (
        <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 2,
            borderBottom: '1px solid #ddd',
            backgroundColor: '#f9f9f9',
        }}
        >
        <Stack direction="row" sx={{ mr: 2, alignItems:"center"}}>
            <Image
            src="/WanderLoggerLogo.png"
            alt="WanderLogger Logo"
            width={55}
            height={40}
            priority
            />

            <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                WanderLogger
            </Typography>

        </Stack>
            

        {router.pathname !== '?' && (
            <Box>
                <ReturnHome/>
            </Box>
        )}
        
        </Box>
    );
}
