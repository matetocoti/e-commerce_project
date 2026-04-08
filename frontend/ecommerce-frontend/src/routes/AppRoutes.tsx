import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const NotFound = () => <h2>404 - Not Found</h2>;
const Loading = () => <h2>Loading...</h2>;

const AppRoutes = () => {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default AppRoutes;