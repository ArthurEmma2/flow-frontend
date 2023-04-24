import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import { green, red } from '@mui/material/colors';
import { Link } from '@mui/material';


interface IProps {
    title: string;
    msg: string;
    type: 'success' | 'failed' | 'pending'
    transaction?: string
}

// const MyCardActions = () => {

//     return (
//         <CardActions>
//             <Link href={transaction}>
//                 Link
//             </Link>
//         </CardActions>
//     )
// }

export default function Notification(props: IProps) {
    return (
        <Card sx={{width: '300px', height: '150px', borderRadius: 1.5}}>
            <CardContent sx={{ padding: '1rem 1rem 0.5rem 1rem'}}>
                <Typography sx={{ fontSize: '1.2rem' }} color="text.secondary" gutterBottom>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 0.5}}>
                            {props.type === 'success' ? <CheckCircleIcon sx={{ color: green[500], padding: 'auto' }}/>: props.type === 'failed' ? <CancelRoundedIcon sx={{ color: red[500], padding: 'auto' }}/> : <PendingRoundedIcon />}
                        </Box>
                        <Box>
                            {props.title}
                        </Box>
                    </Box>
                </Typography>
                {props.type === 'failed' ? <Typography sx={{ fontSize: '1em' }} color="text.secondary">
                    {props.msg.replace("Error: ", "")}</Typography> : <Typography sx={{ fontSize: '1em' }} color="text.secondary">{props.type}</Typography>
                }
            </CardContent>
            {
                props.type === 'success' ? <CardActions sx={{ paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem', textAlign: 'right' }}><Link href="https://www.google.com">Link</Link></CardActions> : <></>
            }
        </Card>
    )
}