import {useLocation} from "react-router-dom";
import {useState, Dispatch, SetStateAction} from "react";


export default function useCurrentPage(): [string, Dispatch<SetStateAction<string>>] {
  const {pathname} = useLocation();
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  if (pathname !== "/new_stream" && pathname.split('/')[1] !== currentPage) {
    setCurrentPage(pathname.split('/')[1]);
  }
  return [currentPage, setCurrentPage];
}

