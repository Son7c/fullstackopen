import { render,screen } from "@testing-library/react";
import Blog from "./Blog"
import userEvent from '@testing-library/user-event'

test('renders Blog',()=>{
    const blog={
        title:'Testing rendering of component',
        author:"Panda",
        url:"https://www.google.com",
        likes:7
    }

    render(<Blog blog={blog}/>)
    const title =screen.queryByText('Testing rendering of component')
    const author=screen.queryByText('Panda')
    const url=screen.queryByText('https://www.google.com')
    const likes=screen.queryByText(7);

    expect(title,author).toBeDefined()
    expect(url,likes).toBeNull()
})

test('Rendering when button is clicked',async ()=>{
    const blog={
        title:'Testing rendering of component',
        author:"Panda",
        url:"https://www.google.com",
        likes:7,
        user:{
            name:"Souvik Majee"
        }
    }

    render(<Blog blog={blog}/>)

    const user = userEvent.setup()
    const btn=screen.getByText('view');
    await user.click(btn);

    const title =screen.queryByText('Testing rendering of component')
    const author=screen.queryByText('Panda')
    const url=screen.queryByText('https://www.google.com')
    const likes=screen.queryByText(7);

    expect(title,author,url,likes).toBeDefined()
    screen.debug()
})